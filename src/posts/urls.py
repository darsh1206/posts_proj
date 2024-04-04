from django.urls import path
from .views import (
    post_list_and_create,
    load_post_datat_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name = 'main-board'),
    path('data/',load_post_datat_view, name ='posts-data')
]