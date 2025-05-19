from django.shortcuts import render  # Dodaj ten import
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from .models import Player, GameHistory
from django.contrib.auth.decorators import login_required
import json

# Nowa funkcja widoku strony głównej (dodaj przed istniejącymi funkcjami)
def home(request):
    return render(request, 'roulette/home.html', {
        'message': 'Welcome to Roulette App!',
        'endpoints': [
            {'name': 'Admin Panel', 'url': '/admin/'},
            {'name': 'Login API', 'url': '/api/login/'},
            {'name': 'Balance API', 'url': '/api/update-balance/'},
            {'name': 'Game History', 'url': '/api/history/'}
        ]
    })

@login_required
def check_auth(request):
    return JsonResponse({'status': 'authenticated'})

@login_required
def get_balance(request):
    player = Player.objects.get(user=request.user)
    return JsonResponse({'balance': player.balance})

@csrf_exempt
def user_login(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            login(request, user)
            player, _ = Player.objects.get_or_create(user=user)
            return JsonResponse({
                'status': 'success',
                'balance': player.balance
            })
        return JsonResponse({'status': 'error'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def update_balance(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        if user.is_authenticated:
            player = Player.objects.get(user=user)
            player.balance = data['balance']
            player.save()

            GameHistory.objects.create(
                player=player,
                amount=data.get('amount', 0),
                bet_type=data.get('bet_type', ''),
                bet_value=data.get('bet_value', ''),
                result=data.get('result', ''),
                payout=data.get('payout', 0)
            )

            return JsonResponse({'status': 'OK'})
        return JsonResponse({'status': 'unauthorized'}, status=401)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def get_game_history(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                player = Player.objects.get(user=request.user)
                history = GameHistory.objects.filter(player=player).order_by('-timestamp')[:10]
                return JsonResponse({
                    'history': [
                        {
                            'bet_type': h.bet_type,
                            'bet_value': h.bet_value,
                            'result': h.result,
                            'payout': h.payout,
                            'timestamp': h.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                        } for h in history
                    ]
                })
            except Player.DoesNotExist:
                return JsonResponse({'error': 'Player profile does not exist'}, status=404)
        return JsonResponse({'status': 'unauthorized'}, status=401)
    return JsonResponse({'error': 'Method not allowed'}, status=405)