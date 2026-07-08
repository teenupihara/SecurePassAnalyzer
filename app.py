from flask import Flask, render_template, request, jsonify
from zxcvbn import zxcvbn
import hashlib
import bcrypt
import secrets
import string

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()
    password = data["password"]

    if not password:
        return jsonify({"error": "Empty password"})

    result = zxcvbn(password)

    # -------------------------
    # HASHES
    # -------------------------
    sha256_hash = hashlib.sha256(
        password.encode()
    ).hexdigest()

    bcrypt_hash = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()

    # -------------------------
    # BREACH CHECK
    # -------------------------
    breached = False

    try:
        with open(
            "breached_passwords.txt",
            "r"
        ) as f:

            breached_list = [
                p.strip().lower()
                for p in f.readlines()
            ]

        if password.lower() in breached_list:
            breached = True

    except FileNotFoundError:
        pass

    # -------------------------
    # BETTER CRACK TIME
    # -------------------------
    score = result["score"]

    if score == 0:
        crack_time = "Instantly"
    elif score == 1:
        crack_time = result["crack_times_display"][
            "online_no_throttling_10_per_second"
        ]
    elif score == 2:
        crack_time = result["crack_times_display"][
            "offline_fast_hashing_1e10_per_second"
        ]
    else:
        crack_time = result["crack_times_display"][
            "offline_slow_hashing_1e4_per_second"
        ]

    # -------------------------
    # Dictionary attack estimate
    # -------------------------
    dictionary_attack = result[
        "crack_times_display"
    ]["online_no_throttling_10_per_second"]

    # -------------------------
    # Brute force estimate
    # -------------------------
    brute_force = result[
        "crack_times_display"
    ]["offline_slow_hashing_1e4_per_second"]

    # -------------------------
    # Entropy
    # -------------------------
    entropy = round(
        result["guesses_log10"],
        2
    )

    return jsonify({

        "score": score,

        "sha256": sha256_hash,

        "bcrypt": bcrypt_hash,

        "crack_time": crack_time,

        "dictionary_attack":
            dictionary_attack,

        "bruteforce":
            brute_force,

        "entropy":
            entropy,

        "breached":
            breached
    })


@app.route("/generate")
def generate():

    chars = (
        string.ascii_letters +
        string.digits +
        "!@#$%^&*()-_=+"
    )

    password = ''.join(
        secrets.choice(chars)
        for _ in range(18)
    )

    return jsonify({
        "password": password
    })


if __name__ == "__main__":
    app.run(debug=True)
