"""
랜드마크 데이터가 담겨 있는 빅데이터를 통해 랜드마크 정보를 불러오고
Landmark 테이블에 모두 저장하는 모듈.
"""
import pandas as pd

from pyproj import Proj, transform, Transformer

from django.core.management import BaseCommand
from apps.landmark.models import Landmark


class Command(BaseCommand):
    help = "Load landmarks from csv into DB"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str)

    def handle(self, *args, **options):
        # X : lon, Y : lat
        df = pd.read_csv(options["csv_file"])
        df.drop_duplicates(subset="KLANG_NM", keep="first", inplace=True)
        df.dropna(subset=["FCLTY_LO", "FCLTY_LA"], inplace=True)

        landmarks = [
            Landmark(
                name=row["KLANG_NM"],
                location_lon=row["FCLTY_LO"],
                location_lat=row["FCLTY_LA"],
            )
            for _, row in df.iterrows()
        ]

        for item in landmarks:
            item.location_lat, item.location_lon = self.translate_utmk_to_wgs84(
                utmk_x=item.location_lat, utmk_y=item.location_lon
            )

        Landmark.objects.bulk_create(landmarks)

    def translate_utmk_to_wgs84(self, utmk_x, utmk_y):
        x, y = utmk_x, utmk_y

        if x < 130 and y < 40:
            return x, y

        proj_UTMK = Proj('epsg:5179')
        proj_WGS84 = Proj('epsg:4326')

        # transformer = Transformer.from_crs("epsg:5179", "epsg:4326")

        # wgs_x, wgs_y = transformer.transform(x, y)

        # wgs_x, wgs_y = transform(proj_WGS84, proj_UTMK, x, y)
        wgs_x, wgs_y = Transformer.from_proj(proj_UTMK, proj_WGS84).transform(xx=x, yy=y)

        return wgs_y, wgs_x
