from django.shortcuts import redirect
from django.conf import settings
from django.urls import path
from assistant_app import views

app_name = 'assistant_app'

urlpatterns = [
    # API endpoints
    path('api/courses/', views.api_courses, name='api_courses'),
    path('api/courses/<course_slug>/modify', views.api_courses, name='api_courses_slug'),


    path('api/courses/grades/', views.api_grades, name='api_all_grades'),
    path('api/courses/grades/<grade_id>/modify/', views.api_grades_modify, name='api_grade'),
    path('api/courses/<course_slug>/grades/', views.api_grades, name='api_grades_for_course'),
    
    
    path('api/courses/assignments/', views.api_assignments, name='api_all_assignments'),
    path('api/courses/assignments/<assignment_id>/modify/', views.api_assignments_modify, name='api_assignment'),
    path('api/courses/<course_slug>/assignments/', views.api_assignments, name='api_assignments_for_course'),
    path('api/courses/assignments/<assignment_id>/complete/', views.api_assignments_complete, name='api_assignment_complete'),


    path('api/csrf/', views.csrf_cookie, name='csrf_cookie'),
    path('api/user/', views.get_user, name='get_user'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/register/', views.api_register, name='api_register'),

    path('api/assignments/upcoming/', views.api_upcoming_deadlines, name='api_upcoming_deadlines'),
    path('api/grades/recent/', views.api_recent_grades, name='api_recent_grades'),
    path('api/news/latest/', views.api_latest_news, name='api_news_latest'),

    path('redirect-to-home/', lambda request: redirect(settings.FRONTEND_URL), name='redirect_to_home'),

]
