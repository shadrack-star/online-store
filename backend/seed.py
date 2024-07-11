from faker import Faker
from app import app, bcrypt, db
from models import User, Product, Order, Review, OrderItem
from datetime import datetime

faker = Faker()

def seed_data():
    with app.app_context():
        # Drop all existing tables and recreate them
        db.drop_all()
        db.create_all()

        # Seed Users
        admin_password = bcrypt.generate_password_hash('admin_password').decode('utf-8')
        admin_user = User(
            username='Admin User',
            email='admin@example.com',
            password=admin_password,
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()  # Commit to generate admin_user.id

        print(f"Admin user ID: {admin_user.id}")  # Debug: Check admin_user.id

        customer_password = bcrypt.generate_password_hash('customer_password').decode('utf-8')
        customer_users = [
            User(username=faker.user_name(), email=faker.email(), password=customer_password, role='customer')
            for _ in range(5)
        ]
        db.session.add_all(customer_users)
        db.session.commit()

        # Seed Products
        products = [
            Product(
                name=faker.word().capitalize(),
                description=faker.text(),
                price=faker.random_number(digits=2),
                category=faker.word(),
                stock=faker.random_number(digits=2),
                image_url=faker.image_url()
            )
            for _ in range(10)
        ]
        db.session.add_all(products)
        db.session.commit()

        # Seed Orders and Order Items
        orders = [
            Order(
                user_id=admin_user.id,  # Ensure admin_user.id is valid here
                total_price=faker.random_number(digits=3),
                status='completed' if i % 2 == 0 else 'pending'
            )
            for i in range(5)
        ]
        db.session.add_all(orders)
        db.session.commit()

        for order in orders:
            for _ in range(2):  # Each order has 2 order items
                product = faker.random_element(products)
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=faker.random_number(digits=1),
                    price=product.price
                )
                db.session.add(order_item)

        # Seed Reviews (using loop for ratings)
        reviews = [
            Review(
                user_id=faker.random_element(customer_users).id,
                product_id=faker.random_element(products).id,
                rating=faker.random.choice([1, 2, 3, 4, 5]),  # Avoid 1 by default
                comment=faker.text()
            )
            for _ in range(15)
        ]
        db.session.add_all(reviews)
        db.session.commit()

if __name__ == '__main__':
    print("Start seeding ....")
    seed_data()
    print("Seeding completed!")