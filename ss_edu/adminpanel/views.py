from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import DocumentGroup, DocumentFile
from .models import Announcement
from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required

@login_required(login_url='/login/')
def admin_dashboard(request):
    return render(request, 'AdminPage.html')

def public_portal(request):
    return render(request, 'index.html')

def login_page(request):
    return render(request, 'LoginPage.html')



@csrf_exempt
def upload_documents(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        category = request.POST.get('category')
        files = request.FILES.getlist('files')

        if not title or not category or not files:
            return JsonResponse({'error': 'Missing fields'}, status=400)

        # Create the DocumentGroup
        group = DocumentGroup.objects.create(
            title=title,
            category=category,
            date_uploaded=timezone.now()
        )

        # Save each uploaded file
        for file in files:
            DocumentFile.objects.create(group=group, file=file)

        return JsonResponse({'message': 'Files uploaded successfully'})
    
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)



@csrf_exempt
def post_announcement(request):
    if request.method == 'POST':
        content = request.POST.get('content')
        category = request.POST.get('category')

        if not content or not category:
            return JsonResponse({'error': 'Missing content or category'}, status=400)

        Announcement.objects.create(
            content=content,
            category=category,
            date_posted=timezone.now()
        )

        return JsonResponse({'message': 'Announcement posted successfully'})

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)


@require_GET
def get_announcements(request, category):
    announcements = Announcement.objects.filter(category=category).order_by('-date_posted')
    data = [
        {
            "id": ann.id,
            "content": ann.content,
            "category": ann.category,
            "date_posted": ann.date_posted.strftime('%d-%b-%Y')
        }
        for ann in announcements
    ]
    return JsonResponse(data, safe=False)

@require_GET
def get_documents(request, category):
    groups = DocumentGroup.objects.filter(category=category).order_by('-date_uploaded')
    data = []
    for group in groups:
        files_data = [
            {
                "file_url": file.file.url,
                "filename": file.file.name.split('/')[-1]
            }
            for file in group.files.all()
        ]
        data.append({
            "id": group.id,
            "title": group.title,
            "category": group.category,
            "date_uploaded": group.date_uploaded.strftime('%d-%b-%Y'),
            "files": files_data
        })
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_announcement(request, announcement_id):
    try:
        announcement = Announcement.objects.get(id=announcement_id)
        announcement.delete()
        return JsonResponse({'message': 'Announcement deleted successfully'})
    except Announcement.DoesNotExist:
        return JsonResponse({'error': 'Announcement not found'}, status=404)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_document_group(request, group_id):
    try:
        group = DocumentGroup.objects.get(id=group_id)

        # Delete each file individually (ensures file is removed from disk)
        for file in group.files.all():
            file.delete()

        # Now delete the group
        group.delete()

        return JsonResponse({'message': 'Document group and files deleted'})
    except DocumentGroup.DoesNotExist:
        return JsonResponse({'error': 'Document group not found'}, status=404)

    
def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')  # Fix here
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            return render(request, 'LoginPage.html', {'error': 'Invalid credentials'})
    
    return render(request, 'LoginPage.html')



def logout_user(request):
    logout(request)
    return redirect('login_page')