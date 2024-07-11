import random
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from datetime import timedelta
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, User, Product, Order, Review, OrderItem
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///store.db"  # Update this to use PostgreSQL in production
app.config["SECRET_KEY"] = "ZK80TsyUbJJenSzm_cKe0yyiDRhwpmVLWofdzwjPEmQ"
app.config["JWT_SECRET_KEY"] = "U-YaTrD6uv_08QLDmclt4jZm0z5gQNdV2lOLfkwE3Eo"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate

# JWT Blacklist
BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

# Routes for authentication
# Register
@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    
    # Extract data from request
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "customer")  # Default role is 'customer'
    profile_image = data.get("profile_image", "")

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    # Validate role
    if role not in ["customer", "admin"]:
        return jsonify({"error": "Invalid role. Role must be either 'customer' or 'admin'."}), 400

    # Create new user
    new_user = User(
        username=username,
        email=email,
        password=bcrypt.generate_password_hash(password).decode('utf-8'),
        role=role,
        profile_image=profile_image,
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username already exists"}), 400

# Login
@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token})

    return jsonify({"error": "Wrong credentials"}), 401

# Fetch current user
@app.route("/api/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "profile_image": user.profile_image
        }), 200
    return jsonify({"error": "User not found"}), 404

# Logout
@app.route("/api/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success": "Successfully logged out"}), 200

# Update profile
@app.route("/api/users/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    data = request.get_json()
    user = User.query.get(id)
    
    if user:
        user.username = data.get('username', user.username)
        if 'password' in data:
            user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user.profile_image = data.get('profile_image', user.profile_image)
        db.session.commit()
        return jsonify({"success": "Profile updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404

# Delete user
@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"error": "User not found"}), 404

# Routes for products
@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        category=data.get("category"),
        stock=data.get("stock"),
        image_url=data.get("image_url"),
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product created successfully"}), 201

@app.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    product_list = [{
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": str(product.price),
        "category": product.category,
        "stock": product.stock,
        "image_url": product.image_url,
    } for product in products]
    return jsonify(product_list), 200

@app.route("/api/products/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get(id)
    if product:
        return jsonify({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": str(product.price),
            "category": product.category,
            "stock": product.stock,
            "image_url": product.image_url,
        }), 200
    return jsonify({"error": "Product not found"}), 404

@app.route("/api/products/<int:id>", methods=["PUT"])
def update_product(id):
    data = request.get_json()
    product = Product.query.get(id)
    if product:
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.category = data.get('category', product.category)
        product.stock = data.get('stock', product.stock)
        product.image_url = data.get('image_url', product.image_url)
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200
    return jsonify({"error": "Product not found"}), 404

@app.route("/api/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get(id)
    if product:
        # Delete associated order items
        OrderItem.query.filter_by(product_id=product.id).delete()
        # Delete associated reviews
        Review.query.filter_by(product_id=product.id).delete()

        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200
    return jsonify({"error": "Product not found"}), 404

# Routes for orders
@app.route("/api/orders", methods=["POST"])
@jwt_required()
def create_order():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_order = Order(
        user_id=current_user_id,
        total_price=data.get("total_price"),
        status=data.get("status", "pending"),
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order created successfully"}), 201

@app.route("/api/orders", methods=["GET"])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    order_list = [{
        "id": order.id,
        "user_id": order.user_id,
        "total_price": str(order.total_price),
        "status": order.status,
    } for order in orders]
    return jsonify(order_list), 200

@app.route("/api/orders/<int:id>", methods=["GET"])
@jwt_required()
def get_order(id):
    order = Order.query.get(id)
    if order:
        return jsonify({
            "id": order.id,
            "user_id": order.user_id,
            "total_price": str(order.total_price),
            "status": order.status,
        }), 200
    return jsonify({"error": "Order not found"}), 404

@app.route("/api/orders/<int:id>", methods=["PUT"])
@jwt_required()
def update_order(id):
    data = request.get_json()
    order = Order.query.get(id)
    if order:
        order.status = data.get('status', order.status)
        db.session.commit()
        return jsonify({"message": "Order updated successfully"}), 200
    return jsonify({"error": "Order not found"}), 404

@app.route("/api/orders/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_order(id):
    order = Order.query.get(id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted successfully"}), 200
    return jsonify({"error": "Order not found"}), 404

# Routes for reviews
@app.route("/api/products/<int:product_id>/reviews", methods=["POST"])
@jwt_required()
def create_review(product_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_review = Review(
        user_id=current_user_id,
        product_id=product_id,
        rating=data.get("rating"),
        comment=data.get("comment"),
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review created successfully"}), 201

@app.route("/api/products/<int:product_id>/reviews", methods=["GET"])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    review_list = [{
        "id": review.id,
        "user_id": review.user_id,
        "product_id": review.product_id,
        "rating": review.rating,
        "comment": review.comment,
    } for review in reviews]
    return jsonify(review_list), 200

@app.route("/api/products/<int:product_id>/reviews/<int:id>", methods=["GET"])
def get_review(product_id, id):
    review = Review.query.get(id)
    if review and review.product_id == product_id:
        return jsonify({
            "id": review.id,
            "user_id": review.user_id,
            "product_id": review.product_id,
            "rating": review.rating,
            "comment": review.comment,
        }), 200
    return jsonify({"error": "Review not found"}), 404

@app.route("/api/products/<int:product_id>/reviews/<int:id>", methods=["PUT"])
@jwt_required()
def update_review(product_id, id):
    data = request.get_json()
    review = Review.query.get(id)
    if review and review.product_id == product_id:
        review.rating = data.get('rating', review.rating)
        review.comment = data.get('comment', review.comment)
        db.session.commit()
        return jsonify({"message": "Review updated successfully"}), 200
    return jsonify({"error": "Review not found"}), 404

@app.route("/api/products/<int:product_id>/reviews/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_review(product_id, id):
    review = Review.query.get(id)
    if review and review.product_id == product_id:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted successfully"}), 200
    return jsonify({"error": "Review not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
