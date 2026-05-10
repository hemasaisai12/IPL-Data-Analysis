import pandas as pd
import numpy as np
from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

def load_data():
    matches = pd.read_csv("matches.csv")
    deliveries = pd.read_csv("deliveries.csv")
    matches['winner'] = matches['winner'].fillna("No Result")
    return matches, deliveries

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/wins")
def wins():
    matches, _ = load_data()
    data = matches['winner'].value_counts()
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/toss")
def toss():
    matches, _ = load_data()
    data = matches['toss_winner'].value_counts()
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/player_of_match")
def player_of_match():
    matches, _ = load_data()
    data = matches['player_of_match'].value_counts().head(10)
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/venues")
def venues():
    matches, _ = load_data()
    data = matches['venue'].value_counts().head(10)
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/team_runs")
def team_runs():
    _, deliveries = load_data()
    data = deliveries.groupby('batting_team')['total_runs'].sum().sort_values(ascending=False)
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/batsmen")
def batsmen():
    _, deliveries = load_data()
    data = deliveries.groupby('batter')['batsman_runs'].sum().sort_values(ascending=False).head(10)
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/bowlers")
def bowlers():
    _, deliveries = load_data()
    wickets = deliveries[deliveries['is_wicket'] == 1]
    data = wickets['bowler'].value_counts().head(10)
    return jsonify({"labels": data.index.tolist(), "values": data.values.tolist()})

@app.route("/api/summary")
def summary():
    matches, deliveries = load_data()
    most_wins_team = matches['winner'].value_counts().idxmax()
    top_batter = deliveries.groupby('batter')['batsman_runs'].sum().idxmax()
    top_venue = matches['venue'].value_counts().idxmax()
    total_matches = len(matches)
    return jsonify({
        "total_matches": int(total_matches),
        "most_wins": most_wins_team,
        "top_batter": top_batter,
        "top_venue": top_venue,
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
