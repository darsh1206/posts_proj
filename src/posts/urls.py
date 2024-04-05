from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_unlike_post,
    post_details,
    post_detail_data_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name = 'main-board'),
    path('data/<int:num_posts>/', load_post_data_view, name='posts-data'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('<pk>/', post_details, name='post-detail'),
    path('<pk>/data/', post_detail_data_view, name='post-detail-data'),
]