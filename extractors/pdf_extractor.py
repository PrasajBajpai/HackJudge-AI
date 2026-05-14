from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):

    text = ""

    reader = PdfReader(file_path)

    for page in reader.pages:

        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    text = text.replace("\n", " ")

    return text[:4000]