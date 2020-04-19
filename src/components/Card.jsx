import React from "react";
import { useState, useEffect } from "react";
import "./Card.css";
import api_axios from "../api.js";
import delivering from "../delivering.gif";
import loader from "../loader.gif";
import loaderblue from "../loader-blue.gif";

const mqtt = require("mqtt");

var options = {
    port: 37267,
    host: "wss://soldier.cloudmqtt.com",
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    username: "vfmquhui",
    password: "yXMUCDc8eoO8",
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    clean: true,
    encoding: "utf8",
};

const client = mqtt.connect("wss://soldier.cloudmqtt.com", options);
client.subscribe("lockerIsOpen");
client.subscribe("lockerIsClosed");
client.subscribe("orderStatus")

function Card(props) {


  // testing
  const [cardStatus, setCardStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [listenMQTT, setListenMQTT] = useState(false)
  const [listenMQTTGuest, setListenMQTTGuest] = useState(false);

  const Loading = () => {
    return <>{isLoading ? <img className='loader' src={loaderblue}/> : <></>}</>;
  };

//props.statusApi
   function handleAccept() {
    setIsLoading(true)
    // if (cardStatus === 'approved') {
    //   setIsLoading(false);
    //   setCardStatus("approved");
    // }
    api_axios
      .get(`/staff/acceptOrder?orderID=${props.orderID}`)
      .then((response) => {
        setIsLoading(false)
        if (response.data === "order approved") {
          props.fetchData()
          //setCardStatus("approved");
          //props.fetchData()
        }else{
          throw new Error(response.data)
        }
      });

  }

    function handleCall() {

    setIsLoading(true);
    api_axios.get(`/staff/foodFinished?orderID=${props.orderID}`) //call avocabot
    .then(response => {
      setIsLoading(false)
      if (response.data === 'OK') {
        props.fetchData()
        //setCardStatus("on the way to department");
        setListenMQTT(true);
      }else{
        throw new Error("server crash")
      }
    })
  }

  useEffect(()=>{
    client.on('message', (topic, message) => {
      if (topic === 'lockerIsOpen' && listenMQTT===true) {
              console.log(topic)
              setIsLoading(false)
              props.fetchData()
              //setCardStatus("arrived at department");
      }
      if (topic === 'lockerIsClosed' && listenMQTT===true) {
        console.log(topic)
        setIsLoading(false)
        // get
        props.fetchData()
        //setCardStatus("on the way");
        setListenMQTTGuest(true)
      }
      if (topic === 'orderStatus' && listenMQTTGuest===true) {
        let obj ={}
        if(message){
          obj = JSON.parse(message.toString())
        }
        console.log(obj)
        if(obj.status=="arrived"){
          props.fetchData()
          //setCardStatus("arrived")
          setListenMQTTGuest(false)

        }

      }
    })
    
  },[listenMQTT,listenMQTTGuest])

  function handleOpen(event) {
    setIsLoading(true)
    api_axios.get('/staff/openLocker')
    .then(response => {
      setIsLoading(false);
      if (response.data === 'OK') {
        setListenMQTT(true); //Avocabot's LED is on
      setIsLoading(true)
      }
    })
  }

  function handleSend(event) {
    setIsLoading(true)
    api_axios.get(`/staff/sendAvocabot?orderID=${props.orderID}`)
    .then(response => {
      setIsLoading(false)
      if (response.data === 'order on the way') {
         //Avocabot's LED is on
         setIsLoading(true)
      }
    })
  }

  // status = pending, approved, on the way

  const renderButton = (cardStatus, statusApi) => {
    switch (statusApi) {
      case "pending":
        return (
          <button className="accept" onClick={handleAccept}>
            Accept Order
          </button>
        );
      case "approved":
        return (
          <button className="call" onClick={handleCall}>
            Call Avocabot
          </button>
        );
      case "on the way to department":
        return ( 
          <img className='loader' src={loader}/>   
        );
      case "arrived at department":
        return (
          <button className="open" onClick={handleOpen}>
            Open Avocabot
          </button>
        );
        case "on the way":
          return (
            <img className='delivering' src={delivering} />
          );
      case "arrived":
        return (
          <p className='arrived'>Arrived!</p>
        );
      case "complete":
        return (
          <div></div>
        );
      // case "delivering":
      //   return <img className="delivering" src={delivering} />;
      // case "success":
      //   return <p>Delivered!</p>;
      // default:
      //   return <p>error</p>;
    }
  };

  // const renderButton = (cardStatus, statusApi) => {

  //   switch (statusApi) {
  //     case "pending":
  //       return (
  //           <button className="accept" onClick={handleAccept}>Accept Order</button>
  //       );
  //     case "approved":
  //       if(cardStatus ==="call" ){
  //         return (
  //             <button className="call" onClick={handleCall}>Call Avocabot</button>
  //         );}
  //       if (cardStatus === 'open') {
  //         return (
  //           <button className="open" onClick={handleOpen}>Open Avocabot</button>
  //         );}
  //       if (cardStatus === 'send') {
  //         return (
  //           <button className="send" onClick={handleSend}>Send Avocabot</button>
  //         );}
  //     case "on the way":
  //       return (
  //         <img className='delivering' src={delivering} />
  //       )
  //     default:
  //       return <p>error</p>
  //   }
  // };

  return (
    <div className="card">
      <div className="top">
        <h2 className="order-id"><span className='orderid'>Order #</span>{props.orderID}</h2>
        <h2 className="roomnumber">Room Number: {props.roomNumber}</h2>
        {/* <button className='callavocabot'>Call Avocabot</button>        */}
      </div>
      <div className="bottom">
        <div className="timestamp">
          <p className="time">
            <span className="tag">Time:</span> {props.timestamp}
          </p>
        </div>
        {/* <p className="customername"><span className='tag'>Customer:</span> {props.customer_name}</p> */}
        <p className="order">
          <div className="tag">Order:</div> {props.orders}{" "}
        </p>
      </div>
      { !isLoading && renderButton(cardStatus, props.statusApi)}
      <Loading/>
    </div>
  );
}

export default Card;
