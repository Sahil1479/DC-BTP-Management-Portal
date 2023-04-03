import random
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save


class Skills(models.Model):
    skill = models.CharField(max_length=60)

    class Meta:
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'

    def __str__(self):
        return self.skill


class Roles(models.Model):
    ROLES = (
        ('Student', 'Student'),
        ('Faculty', 'Faculty'),
        ('Faculty Advisor', 'Faculty Advisor'),
        ('Department Office', 'Department Office'),
        ('Head of Department', 'Head of Department')
    )
    role = models.CharField(max_length=25, choices=ROLES, default='Student')

    class Meta:
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.role


class Courses(models.Model):
    course = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return self.course


class ProgramAndBranch(models.Model):
    """
    @Roll_number = B19EE024
    => program = CATEGORY
    => name = Electrical Engineering
    => abbreviation = BTech EE
    => getter = B/EE
    """
    CATEGORY = (
        ('BTech', 'BTech'),
    )
    program = models.CharField(max_length=10, choices=CATEGORY, default="BTech")
    name = models.CharField(max_length=60, default="Electrical Engineering")
    abbreviation = models.CharField(max_length=20, blank=True, null=True)
    getter = models.CharField(max_length=10, default="B/EE")

    def __str__(self):
        return self.program + " " + self.name


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    roll_number = models.CharField(max_length=15)
    year = models.SmallIntegerField()
    program_branch = models.ForeignKey(ProgramAndBranch, on_delete=models.PROTECT)
    cgpa = models.FloatField()
    skills = models.TextField(blank=True)
    courses = models.TextField(blank=True)
    registration_timestamp = models.DateTimeField(auto_now_add = True, blank = True, null = True)

    def __str__(self):
        return self.user.get_full_name()


class Resume(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resume')
    timestamp = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=200, null=True, blank=True,
                                 help_text="Enter a reference name for this resume by which you can remember the details of this particular resume")

    def __str__(self):
        if not self.reference:
            return "No reference"
        else:
            return self.reference


def event_pre_save_receiver_resume(sender, instance, *args, **kwargs):
    if (instance.student.user.first_name not in instance.file.name or
            instance.student.user.last_name not in instance.file.name or
            instance.student.roll_number not in instance.file.name or
            'IIT Jodhpur.pdf' not in instance.file.name) \
            and instance._state.adding is True:
        instance.file.name = instance.student.user.first_name + '_' + instance.student.user.last_name \
            + '_' + instance.student.roll_number + '_' + str(random.randint(1, 10001)) + \
            '_' + 'IIT Jodhpur.pdf'
    if not instance.reference:
        instance.reference = instance.file.name


pre_save.connect(event_pre_save_receiver_resume, sender=Resume)


class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    program_branch = models.ForeignKey(ProgramAndBranch, on_delete=models.PROTECT)
    description = models.TextField(blank=True)
    registration_timestamp = models.DateTimeField(auto_now_add = True, blank = True, null = True)

    class Meta:
        verbose_name = 'Faculty'
        verbose_name_plural = 'Faculties'

    def __str__(self):
        return self.user.get_full_name()


class FacultyAdvisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    course_code = models.CharField(max_length=10)
    program_branch = models.ForeignKey(ProgramAndBranch, on_delete=models.PROTECT)
    registration_timestamp = models.DateTimeField(auto_now_add = True, blank = True, null = True)

    class Meta:
        verbose_name = 'Faculty Advisor'
        verbose_name_plural = 'Faculty Advisors'

    def __str__(self):
        return self.user.get_full_name()


class DepartmentOffice(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    program_branch = models.ForeignKey(ProgramAndBranch, on_delete=models.PROTECT)
    registration_timestamp = models.DateTimeField(auto_now_add = True, blank = True, null = True)

    class Meta:
        verbose_name = 'Department Office'
        verbose_name_plural = 'Department Offices'

    def __str__(self):
        return self.user.get_full_name()


class HeadOfDepartment(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)
    program_branch = models.ForeignKey(ProgramAndBranch, on_delete=models.PROTECT)
    registration_timestamp = models.DateTimeField(auto_now_add = True, blank = True, null = True)

    class Meta:
        verbose_name = 'Head Of Department'
        verbose_name_plural = 'Head Of Departments'

    def __str__(self):
        return self.user.get_full_name()
