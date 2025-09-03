# Jump Labeling

Typescript React + Vite front end, Python flask backend, AWS S3 for
storage.\
A tool designed to make labeling geo-location data labeling easier,\
Display the data in 3d (lat, lng, time) for easy viewing of overlapping
points (using RTF).

Supports uploading files, saving, and viewing shared files of labeled
data.\
To label we click the points displayed in 3d toggeling between Jump and
not Jump.

We can also see statistics which include total samples, total jump
samples, total non-jump samples, and the same for the file currently
being viewed.

---

## Configure environment variables for front end:

```env
VITE_API_URL=""
```

## Configure environment variables for back end:

```env
FLASK_ENV="development"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
S3_BUCKET_NAME=""
S3_STATS_KEY=""
CORS_ORIGIN=""

ADMIN_PASSWORD_HASH=""
JWT_SECRET_KEY=""
```

---

## To run locally front end:

```sh
npm install
npm run dev
```

## For backend:

```sh
pip install -r requirements.txt
python app.py
```
