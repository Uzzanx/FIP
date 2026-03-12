import io
from PIL import Image
import qrcode
from qrcode.image.styledpil import StyledPilImage


class QRGeneratorService:
    """Сервис для генерации QR-кодов"""
    
    @staticmethod
    def generate_qr_code(data: str, size: int = 200) -> bytes:
        """Генерация QR-кода в формате PNG"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Создаём изображение
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Изменяем размер
        img = img.resize((size, size), Image.LANCZOS)
        
        # Преобразуем в bytes
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return img_buffer.getvalue()
    
    @staticmethod
    def generate_user_qr(qr_token: str) -> bytes:
        """Генерация QR-кода для пользователя"""
        return QRGeneratorService.generate_qr_code(qr_token, size=200)