FROM amd64/ubuntu
RUN apt update && apt install -y python3-pip
RUN pip3 install fastapi uvicorn pysolr
WORKDIR /
COPY Phoneme_extraction.py Phoneme_extraction.py
EXPOSE 8000
CMD ["uvicorn", "Phoneme_extraction:app", "--host", "0.0.0.0", "--port", "8000"]
# docker build -t jeyendra/wordphonemes-fastapi --platform linux/amd64 .