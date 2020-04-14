import React from "react";
import { useState, useEffect } from "react";
import "./Card.css";

function Card(props) {

  const [isAcceptClicked, setIsAcceptClicked] = useState(false);
  const [avocabotStatus, setAvocabotStatus] = useState(""); //เวลา avocabot มาฝั่ง back จะส่งอะไรมา alert maika
  const [isCalled, setIsCalled] = useState(false);
  
  function handleAccept(event) {
    setIsAcceptClicked(true);
    // const style="background-color: #C1B841"
  }

  function handleCallAvocabot(event) { 
    //ส่งไปว่าเรียกแล้วนะ!
    setAvocabotStatus("Called");
    console.log("Called");
    setIsCalled(true);
  }

    return (
        <div className="card">
        <div className="top">
          <h2 className="name">Order ID: {props.order_id}</h2>
          <h2 className="roomnumber">Room Number: {props.room_number}</h2>  
          {/* <button className='callavocabot'>Call Avocabot</button>        */}
        </div>
        <div className="bottom">
          {/* <p className="customername"><span className='tag'>Customer:</span> {props.customer_name}</p> */}
          <p className="order"><span className='tag'>Order:</span> {props.order_items}</p>
          <p className="time"><span className='tag'>Time:</span> {props.time}</p>
          <p className="cost"><span className='tag'>Total Cost:</span> {props.cost} Baht</p>
        </div>
        <div className="button">
          <button className={isAcceptClicked ? 'accept-button' : 'not-accept-button'} name='accept' onClick={handleAccept}>Accept</button>
        </div>
        <div>
          {isAcceptClicked ? <button className={isCalled ? 'call-avocabot' : 'not-call-avocabot'} onClick={handleCallAvocabot}>Call Avocabot</button> : null}
        </div>
      </div>

    )
}

export default Card;