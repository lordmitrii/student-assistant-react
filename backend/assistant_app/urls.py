from django.urls import path
from assistant_app import views, api

app_name = 'assistant_app'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),

    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('account/', views.account_view, name='account'),

    path('calculator/', views.calculator, name='calculator'),

    # View all courses
    path('courses/', views.courses, name='courses'),
    path('courses/add/', views.add_course, name='add_course'),
    path('courses/<slug:course_slug>/edit/', views.edit_course, name='edit_course'),
    path('courses/<slug:course_slug>/delete/', views.delete_course, name='delete_course'),
    
    # In case we view grades for all courses
    path('courses/grades/', views.grades, name='all_grades'),
    path('courses/grades/add/', views.add_grade, name='add_grade'),
    path('courses/grades/<int:grade_id>/edit/', views.edit_grade, name='edit_grade'),
    path('courses/grades/<int:grade_id>/delete/', views.delete_grade, name='delete_grade'),

    # In case we view grades for a specific course
    path('courses/<slug:course_slug>/grades/', views.grades, name='grades_for_course'),
    path('courses/<slug:course_slug>/grades/add/', views.add_grade, name='add_grade_for_course'),
    path('courses/<slug:course_slug>/grades/<int:grade_id>/edit/', views.edit_grade, name='edit_grade_for_course'),
    path('courses/<slug:course_slug>/grades/<int:grade_id>/delete/', views.delete_grade, name='delete_grade_for_course'),

    # In case we view assignments for all courses
    path('courses/assignments/', views.assignments, name='all_assignments'),
    path('courses/assignments/add/', views.add_assignment, name='add_assignment'),
    path('courses/assignments/<int:assignment_id>/edit/', views.edit_assignment, name='edit_assignment'),
    path('courses/assignments/<int:assignment_id>/delete/', views.delete_assignment, name='delete_assignment'),

    # In case we view assignments for a specific course
    path('courses/<slug:course_slug>/assignments/', views.assignments, name='assignments_for_course'),
    path('courses/<slug:course_slug>/assignments/add/', views.add_assignment, name='add_assignment_for_course'),   
    path('courses/<slug:course_slug>/assignments/<int:assignment_id>/edit/', views.edit_assignment, name='edit_assignment_for_course'),
    path('courses/<slug:course_slug>/assignments/<int:assignment_id>/delete/', views.delete_assignment, name='delete_assignment_for_course'),


    # Helpers for AJAX
    path('ajax/get_assignments/', views.get_assignments, name='ajax_get_assignments'),
    path('ajax/assignments/<int:assignment_id>/complete/', views.mark_assignment_complete, name='ajax_assignment_complete'),


    # API endpoints
    path('api/courses/', api.api_courses, name='api_courses'),
    path('api/courses/<slug:course_slug>/modify', api.api_courses, name='api_courses_slug'),


    path('api/courses/grades/', api.api_grades, name='api_all_grades'),
    path('api/courses/grades/modify/', api.api_grades_modify, name='api_grade'),
    path('api/courses/<slug:course_slug>/grades/', api.api_grades, name='api_grades_for_course'),
    
    
    path('api/courses/assignments/', api.api_assignments, name='api_all_assignments'),
    path('api/courses/assignments/modify/', api.api_assignments_modify, name='api_assignment'),
    path('api/courses/<slug:course_slug>/assignments/', api.api_assignments, name='api_assignments_for_course'),

    # In case we view grades for a specific course
    # path('api/courses/<slug:course_slug>/grades/add/', api.api_add_grade, name='api_add_grade_for_course'),
    # path('api/courses/<slug:course_slug>/grades/<int:grade_id>/edit/', api.api_edit_grade, name='api_edit_grade_for_course'),
    # path('api/courses/<slug:course_slug>/grades/<int:grade_id>/delete/', api.api_delete_grade, name='api_celete_grade_for_course'),



    path('api/csrf/', api.csrf_cookie, name='csrf_cookie'),
    path('api/user/', api.get_user, name='get_user'),
    path('api/login/', api.api_login, name='api_login'),
    path('api/logout/', api.api_logout, name='api_logout'),
    path('api/assignments/upcoming/', api.api_upcoming_deadlines, name='api_upcoming_deadlines'),
    path('api/grades/recent/', api.api_recent_grades, name='api_recent_grades'),
    path('api/news/latest/', api.api_latest_news, name='api_news_latest'),
]
