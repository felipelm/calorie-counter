# Backend

## Admin and Manager

### To Create a Admin User

```
python manage.py createsuperuser
```

### To Create a Manager User

1. Log in to admin dashboard
2. Create manager group if doesn't exists
3. Assign to group to desired user

## Tests

```
python manage.py test
```

```
coverage run --source='.' manage.py test calories accounts
coverage report
```

## Running Tests with Docker (Example)

```
docker-compose up backend
docker exec backend_1 coverage run --source='.' manage.py test calories accounts
docker exec backend_1 coverage report
```