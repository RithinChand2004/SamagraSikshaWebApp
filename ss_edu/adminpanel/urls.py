from django.urls import path
from . import views

urlpatterns = [
    path('upload-document/', views.upload_documents, name='upload_documents'),
    path('post-announcement/', views.post_announcement, name='post_announcement'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('', views.public_portal, name='public_portal'),
    path('login/', views.login_page, name='login_page'),
    path('announcements/<str:category>/', views.get_announcements, name='get_announcements'),
    path('documents/<str:category>/', views.get_documents, name='get_documents'),
    path('delete-announcement/<int:announcement_id>/', views.delete_announcement),
    path('delete-document-group/<int:group_id>/', views.delete_document_group),
    path('login/', views.login_page, name='login_page'),
    path('logout/', views.logout_user, name='logout_user'),
]
