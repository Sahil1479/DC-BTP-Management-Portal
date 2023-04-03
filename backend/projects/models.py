from django.db import models
from django.contrib.auth.models import User
from main.models import Student, Faculty, ProgramAndBranch


class Type(models.Model):
    PROJECT_TYPE = (
        ('Design Credits', 'Design Credits'),
        ('B.Tech. Project', 'B.Tech. Project')
    )
    application_type = models.CharField(max_length=20, choices=PROJECT_TYPE, default='Design Credits')

    class Meta:
        verbose_name = 'Project Type'
        verbose_name_plural = 'Project Type'

    def __str__(self):
        return self.application_type


class Categories(models.Model):
    CATEGORIES = (
        ('Category 1', 'Category 1'),
        ('Category 2', 'Category 2'),
        ('Category 3', 'Category 3'),
        ('Category 4', 'Category 4'),
        ('Category 5', 'Category 5'),
        ('Category 6', 'Category 6'),
        ('B.Tech. Project', 'B.Tech. Project')
    )
    category = models.CharField(max_length=20, choices=CATEGORIES, default='Category 1')
    description = models.TextField(default='')
    total_credits_allowed = models.SmallIntegerField()

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.category


class Project(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.PROTECT)
    category = models.ManyToManyField(Categories)
    title = models.CharField(max_length=255)
    description = models.TextField()
    deliverables = models.TextField()
    skills = models.TextField(blank=True)
    courses = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.title


class ApplicationCourse(models.Model):
    course_code = models.CharField(max_length=10)
    course_name = models.CharField(max_length=50)
    program_branch = models.ForeignKey(ProgramAndBranch, null=True, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return (self.course_code + ' (' + self.course_name + ')')


class Application(models.Model):
    GRADES = (
        ('A*', 'A*'),
        ('A', 'A'),
        ('A-', 'A-'),
        ('B', 'B'),
        ('B-', 'B-'),
        ('C', 'C'),
        ('C-', 'C-'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
        ('I', 'I'),
        ('S', 'S'),
        ('X', 'X'),
        ('U', 'U'),
        ('W', 'W'),
        ('None', 'None'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    application_type = models.ForeignKey(Type, on_delete=models.PROTECT)
    course_code = models.ForeignKey(ApplicationCourse, on_delete=models.PROTECT)
    is_accepted = models.BooleanField(default=False)
    resume_link = models.TextField(blank=True, null=True)
    report_link = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True)
    grade = models.CharField(max_length=10, choices=GRADES, default="None")
    is_withdrawn = models.BooleanField(default=False)

    def __str__(self):
        return str(self.project.title) + " (" + str(self.student.roll_number) + ")" 


class IndustryApplication(models.Model):
    GRADES = (
        ('A*', 'A*'),
        ('A', 'A'),
        ('A-', 'A-'),
        ('B', 'B'),
        ('B-', 'B-'),
        ('C', 'C'),
        ('C-', 'C-'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
        ('I', 'I'),
        ('S', 'S'),
        ('X', 'X'),
        ('U', 'U'),
        ('W', 'W'),
        ('None', 'None'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    deliverables = models.TextField()
    application_type = models.ForeignKey(Type, null=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(Categories, null=True, on_delete=models.SET_NULL)
    course = models.ForeignKey(ApplicationCourse, on_delete=models.CASCADE)
    organization_name = models.TextField()
    mentors_name = models.TextField()
    mentors_designation = models.TextField()
    mentors_email = models.TextField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    report_link = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True)
    grade = models.CharField(max_length=10, choices=GRADES, default="None")
    is_withdrawn = models.BooleanField(default=False)

    def __str__(self):
        return str(self.title) + " (" + str(self.student.roll_number) + ")" 



class ApplicationComment(models.Model):
    comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    # reply = models.ForeignKey('ApplicationComment', on_delete=models.CASCADE, blank=True, null=True, related_name="replies")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment[0:13] + "(" + self.user.get_full_name() + ", " + self.application.project.title + ")"
