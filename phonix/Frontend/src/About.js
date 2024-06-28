import React from 'react';
import './About.css';
// import {useNavigate} from 'react-router-dom';
import prof from './Assets/professor.png'
import ta from './Assets/ta.png'
import har from  './Assets/h1.png'
import kash from './Assets/kashyap.png'
import pra from './Assets/pratiksha.png'
import  jay from './Assets/jeyendra.png'
import kri from  './Assets/kri.png'
function About() {


    return (<div>
          <header>
            <h1>Motivation</h1>
            <p>This project empowers individuals with speech difficulties and equip speech pathologists with better tools. We believe everyone deserves clear communication and overcoming speech challenges can profoundly impact lives. For individuals, we provide accessible, engaging tools to make speech improvement easier and more enjoyable. For speech pathologists, we offer innovative tools to streamline workflows and personalize treatment plans, freeing up time for building patient relationships and delivering personalized care. Ultimately, we aim to remove communication barriers, build confidence, and empower both individuals and speech pathologists to achieve their full potential.</p>
        {/* <h1>Welcome to Your Web Tool Name</h1> */}
    </header>
{/* 
    <main>
        
        <section>
            <h2>Feature 1: Include/Exclude</h2>
            
        </section>

        <section>
            <h2>Feature 2: Position</h2>
            
        </section>

        <section>
            <h2>Feature 3: Minimal/Maximal</h2>
            
        </section>

        <section>
            <h2>Feature 4: Minimal/Maximal Word</h2>
            
        </section>
    </main> */}

        <h2> Meet the Team </h2>
        <div className="flex-container">

            <div className="flex-item">
                <h3>Professor Jinjun Xiong</h3>
                <img src={prof} alt="Professor Photo"></img>
            </div>
            <div className="flex-item">
                <h3>Teaching Assistant (TA) Yuting Hu</h3>
                <img src={ta} alt="TA Photo" style={{ width: '300px', height: '275px' }}></img>
            </div>
        </div>

        <div className="flex-container five-images-container">

            <div className="five-images-item">
                <h3>Haritha</h3>
                <img src={har} alt="Student 2 Photo" style={{ width: '300px', height: '275px' }}></img>
                <p>University at Buffalo</p>
            </div>

            <div className="five-images-item">
  <h3>Jeyendra</h3>
  <img
    src={jay}
    alt="Student 1 Photo"
    style={{ width: '300px', height: '275px' }}
  />
  <p>University at Buffalo</p>
</div>



            <div className="five-images-item">
                <h3>Kashyap</h3>
                <img src={kash} alt="Student 2 Photo" style={{ width: '300px', height: '275px' }}></img>
                <p>University at Buffalo</p>
            </div>
            <div className="five-images-item">
                <h3>Pratiksha</h3>
                <img src={pra} alt="Student 2 Photo" style={{ width: '300px', height: '275px' }}></img>
                <p>University at Buffalo</p>
            </div>
            <div className="five-images-item">
                <h3>Kriti</h3>
                <img src={kri} alt="Student 2 Photo" style={{ width: '300px', height: '275px' }}></img>
                <p>University at Buffalo</p>
            </div>
        </div>
    </div>);
}

export default About;