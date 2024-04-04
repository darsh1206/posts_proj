from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

def load_post_datat_view(request):
    qs = Post.objects.all()
    data =[]
    for obj in qs:
        item={
            'id':obj.id,
            'title':obj.title,
            'body':obj.body,
            'author':obj.author.user.username
        }
        data.append(item)
    return JsonResponse({'data':data})

