catatan perubahan:
- nambahin break di switch case errorHandler
- port dan listen dipindah ke bin/www
- urutan user dan activities diubah di dalam file router.js dan user.js dalam folder routes
- menambahkan file .env.example
- menambahkan folder __tests__
- nambah {} di dalam await Activity.create di postActivity
- nambah poin status di postActivity
- nambah {} dan where:id di updateActivity
- ada banyak typo di controller yang udah diperbaiki

Selanjutnya:
[x] bikin route dan controller untuk rewards (read) aja
[x] bikin route dan controller untuk UserActivities (create, read, delete)
[x] bikin route dan controller untuk UserRewards (create dan read)
[ ] pagination dan filter dari lokasi untuk get all activities