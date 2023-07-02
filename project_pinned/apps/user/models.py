from uuid import uuid4

from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    PermissionsMixin,
    AbstractBaseUser,
)
from django.utils.translation import gettext_lazy as _
from django.conf import settings

from apps.base.models import BaseModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password, username):
        """
        Create a User instance with personal information such as email, nickname, Korean name, and password given
        """
        if not email:
            raise ValueError(_("Users must have an email address"))

        user = self.model(
            email=self.normalize_email(email),
            user_id=uuid4(),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, username):
        """
        Create a SuperUser instance with personal information such as email, nickname, Korean name, and password given
        Grant superuser privileges after account creation.
        """
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )

        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(default=uuid4, editable=False, unique=True)
    username = models.CharField(
        verbose_name=_("username"),
        max_length=100,
        unique=False,
        null=True,
    )
    email = models.EmailField(_("email address"), blank=True, unique=True)
    profile_image = models.ImageField(
        null=True, blank=True, upload_to='profile_images/'
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    following = models.ManyToManyField(
        "self", through="Follow", related_name="followers", symmetrical=False
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into admin site.'),
    )

    EMAIL_FIELD = "email"
    USERID_FIELD = "user_id"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return f"{self.username} {self.email}"

    def get_user_id(self):
        return getattr(self, self.USERID_FIELD)

    def natural_key(self):
        return (self.get_user_id(),)

    def follower_count(self):
        # Pylint Linter가 Follow 테이블의 관계에서 follower_set을 이해하지 못해서 complain함.
        # 코드 작동에는 문제 없음.
        return self.follower_set.count()

    def following_count(self):
        # Pylint Linter가 Follow 테이블의 관계에서 following_set을 이해하지 못해서 complain함.
        # 코드 작동에는 문제 없음.
        return self.following_set.count()


class Follow(BaseModel):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="following_set"
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="follower_set"
    )

    class Meta:
        unique_together = ["follower", "following"]
