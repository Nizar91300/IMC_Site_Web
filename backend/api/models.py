from django.db import models
from django.contrib.auth.models import User

# classe pour stocker les calculs IMC
class IMCCalculation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="imc_calculations")
    poids = models.FloatField()
    taille = models.FloatField()  # en cm
    imc = models.FloatField()
    statut = models.CharField(max_length=50)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.imc} ({self.statut})"