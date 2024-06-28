import json
import sqlalchemy
from flask import Flask, render_template, request, redirect, flash
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.sql import func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask_googlecharts import GoogleCharts
from flask_googlecharts import BarChart
# from flask_charts import Chart

app = Flask(__name__)
charts = GoogleCharts(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Pass%40123@localhost:5432/ipl"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

engine = sqlalchemy.create_engine('postgresql://postgres:Pass%40123@localhost:5432/ipl', pool_pre_ping=True)
# Session = sessionmaker(bind=engine)
curr_session = Session(engine)

Base = automap_base()
Base.prepare(engine, reflect=True)
team = Base.classes.team
player_details_table = Base.classes.player

# class Team(db.Model):
#     __table__ = table("team", column("id"), column("team_name"), column('team_short_code'))
#     __tablename__ = "team"
#     id = db.Column(db.Integer(), primary_key=True)
#     team_name = db.Column(db.String())
#     team_short_code = db.Column(db.String())
#
#     def __init__(self, id , team_name, team_short_code):
#         self.id = id
#         self.team_name = team_name
#         self.team_short_code = team_short_code
#
#     def __repr__(self):
#         return f"{self.id}:{self.team_name}"
#
conn = psycopg2.connect(
    host="localhost",
    database="ipl",
    user="postgres",
    password="Pass@123")

cur = conn.cursor()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/addTeam')
def get_add_team_page():
    return render_template("addTeam.html")


@app.route('/team/add', methods=["POST"])
def add_team():
    try:
        team_id = request.form['team_id']
        team_name = request.form['team_name']
        team_short_code = request.form['team_short_code']
        # curr_session = Session(engine)
        record = team(team_id=team_id, team_name=team_name, team_short_code=team_short_code)
        curr_session.add(record)
        curr_session.flush()
        curr_session.commit()
        return redirect('/display_teams')
    except Exception as e:
        return render_template('Error.html', error_s=str(e))


@app.route("/display_teams", methods=["GET"])
def display_teams():
    res = db.session.query(team).all()
    teams = []
    for i in res:
        teams.append([i.team_id, i.team_name, i.team_short_code])
    return render_template("Teams.html", teams=teams)


@app.route('/player/add', methods=["POST"])
def add_new_player():
    err_s = ""
    try:
        player_id = request.form["player_id"]
        player_name = request.form["player_name"]
        date_of_birth = request.form["date_of_birth"]
        batting_hand = request.form["batting_hand"]
        bowling = request.form["bowling"]
        country = request.form["country"]
        record = player_details_table(player_id=player_id, player_name=player_name, dob=date_of_birth,
                                      batting_hand=batting_hand, bowling_skill=bowling, country=country, is_umpire=False)
        curr_session.add(record)
        curr_session.flush()
        curr_session.commit()
        return redirect('/display_player')
    except Exception as e:
        err_s = str(e)
    return render_template("Error.html", error_s=err_s)


@app.route('/addplayer')
def add_player_form():
    return render_template("addPlayer.html")


@app.route("/team/edit/<team_id>", methods=["POST"])
def team_edit(team_id):
    team_edit_id = db.session.query(team).filter_by(team_id=team_id).first()
    new_team_id = request.form["team_id"]
    new_team_name = request.form["team_name"]
    new_team_code = request.form['team_short_code']
    team_edit_id.team_id = new_team_id
    team_edit_id.team_name = new_team_name
    team_edit_id.team_short_code = new_team_code
    db.session.commit()
    return redirect('/display_teams')

@app.route('/player/edit/<player_id>', methods=["POST"])
def player_edit(player_id):
    err_s = ""
    try:
        player_to_edit = db.session.query(player_details_table).filter_by(player_id=player_id).first()
        player_to_edit.player_id = request.form["player_id"]
        player_to_edit.player_name = request.form["player_name"]
        player_to_edit.dob = request.form["date_of_birth"]
        player_to_edit.batting_hand = request.form["batting_hand"]
        player_to_edit.bowling_skill = request.form["bowling"]
        player_to_edit.is_umpire = False
        player_to_edit.country = request.form["country"]
        db.session.commit()
        return redirect('/display_player')
    except Exception as e:
        err_s = str(e)
        pass
    return  render_template("Error.html", error_s=err_s)

@app.route('/edit_team/<team_id>', methods=["POST", "GET"])
def edit_team(team_id):
    team_to_edit = db.session.query(team).filter_by(team_id=team_id).first()
    team_to_edit = [team_to_edit.team_id, team_to_edit.team_name, team_to_edit.team_short_code]
    return render_template("edit_team.html", team=team_to_edit)


@app.route('/edit_player/<player_id>', methods = ["POST","GET"])
def edit_player(player_id):
    try:
        player_to_edit = db.session.query(player_details_table).filter_by(player_id=player_id).first()
        player_to_edit = [player_to_edit.player_id, player_to_edit.player_name, player_to_edit.dob, player_to_edit.batting_hand, player_to_edit.bowling_skill, player_to_edit.country, player_to_edit.is_umpire]
        return render_template("edit_player.html", player=player_to_edit)
    except Exception as e:
        pass

    return  render_template("Error.html", error_s=str(e))


@app.route('/delete_player/<player_id>')
def delete_player(player_id):
    try:
        db.session.query(player_details_table).filter_by(player_id=player_id).delete()
        db.session.commit()
        return redirect('/display_player')
    except Exception as e:
        err_s = str(e)

    return render_template("Error.html", error_s=err_s)

@app.route("/display_player", methods=["GET"])
def display_player():
    res = db.session.query(player_details_table).all()
    players = []
    for i in res:
        players.append([i.player_id, i.player_name, i.dob, i.batting_hand, i.bowling_skill, i.country, i.is_umpire])
    # print(players)
    return render_template("player_details.html", players=players)


@app.route('/season')
def season():
    cur.execute("select season_year from season;")
    seasons = cur.fetchall()
    seasons = [seas[0] for seas in seasons]
    # print(seasons)
    return render_template('season.html', seasons=seasons)


@app.route('/delete_team/<team_id>')
def delete_team(team_id):
    error_s = ""
    try:
        db.session.query(team).filter_by(team_id=team_id).delete()
        db.session.commit()
        # return redirect('/display')
    except Exception as e:
        # print(e)
        # print(str(e))
        error_s = str(e)
        return render_template("Error.html", error_s=error_s)
    return redirect('/display_teams')


@app.route('/crudoperations')
def display_crudoperations():
    return render_template("CrudOperations.html")


@app.route('/season/<season_year>')
def get_season_matches(season_year):
    query = '''select match.match_id, t1.team_name,
                       t2.team_name,
                       t3.team_short_code,
                       match.win_type,
                       match.won_by,
                       match.match_date,
                       match.city_name,
                       match.venue_name
                from team t1,
                     team t2,
                     team t3,
                     match
                where t1.team_id = match.team_name_id
                  and t2.team_id = match.opponent_team_id
                  and t3.team_id = match.match_winner_id
                  and match.match_id in (select match.match_id
                                         from match,
                                              season s
                                         where match.season_id = s.season_id
                                           and s.season_year = ''' + str(
        season_year) + " order by match.match_date ASC );"
    cur.execute(query)
    result = cur.fetchall()
    match_details = [
        [details[0], details[1], details[2], details[3], details[4], details[5], details[6], details[7], details[8]] for
        details in result]
    print(match_details)
    return render_template('season_matches.html', match_details=match_details, len=len(match_details), year=season_year)


@app.route('/season/match/<match_id>')
def get_match_details(match_id):
    query = '''select match_date,
               t1.team_name,
               t2.team_name,
               venue_name,
               t3.team_name,
               toss_decision,
               is_superover,
               win_type,
               won_by,
               t4.team_name,
               p1.player_name,
               p2.player_name,
               p3.player_name,
               city_name,
               host_country
        from team t4,
             team t1,
             team t2,
             team t3,
             match,
             player p1,
             player p2,
             player p3
        where t1.team_id = match.team_name_id and
              t2.team_id = match.opponent_team_id and
              t3.team_id = match.toss_winner_id and
              t4.team_id = match.match_winner_id and
              p1.player_id = match.man_of_the_match_id and
              p2.player_id = match.first_umpire_id and
              p3.player_id = match.second_umpire_id and 
              match_id= ''' + match_id
    cur.execute(query)
    result = cur.fetchall()
    result = list(result[0])
    return render_template("match_info.html", result=result)
    return list(result[0])


@app.route('/bulkinsert')
def bulk_inser():
    return render_template("bulkinsert.html")

@app.route('/batperf')
def batsmenperf():
    quer = '''SELECT player_name,
       Count(batsman_scored)
FROM   player,
       ballbyball
WHERE  ( ballbyball.batsman_scored = 6
          OR ballbyball.batsman_scored = 4 )
       AND ballbyball.striker_id = player.player_id
GROUP  BY player_name
ORDER  BY Count(batsman_scored) DESC;'''
    cur.execute(quer)
    result = cur.fetchall()
    print(result)
    batperf = dict()
    for i in result[:30]:
        batperf[i[0]] = i[1]
    return render_template("bat perf.html", nan_json =  batperf)

app.run(host='0.0.0.0', port=9999, debug=True)
