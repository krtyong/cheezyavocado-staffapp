import React from "react";
import { useState, useEffect } from "react";
import "./Card.css";
import api_axios from "../api.js";
import delivering from "../delivering.gif";
import loader from "../loader.gif";
import loaderblue from "../loader-blue.gif";
import client from "../mqtt.js"


client.subscribe("lockerIsOpen");
client.subscribe("lockerIsClosed");
client.subscribe("orderStatus");

function Card(props) {
  // testing
  const [cardStatus, setCardStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [listenMQTT, setListenMQTT] = useState(false);
  const [listenMQTTGuest, setListenMQTTGuest] = useState(false);
  const [lockerIsOpenButton, setLockerIsOpenButton] = useState(true);
  const [orderIsAccepted, setOrderIsAccepted] = useState(false);

  const Loading = () => {
    return (
      <>{isLoading ? <img className="loader" src={loaderblue} /> : <></>}</>
    );
  };

  //props.statusApi
  function handleAccept() {
    setIsLoading(true);
    // if (cardStatus === 'approved') {
    //   setIsLoading(false);
    //   setCardStatus("approved");
    // }
    api_axios
      .get(`/staff/acceptOrder?orderID=${props.orderID}`)
      .then((response) => {
        setIsLoading(false);
        if (response.data === "order approved") {
          props.fetchData();
          setOrderIsAccepted(true);
          //setCardStatus("approved");
        } else {
          throw new Error(response.data);
        }
      });
  }

  function handleCall() {
    setIsLoading(true);
    api_axios
      .get(`/staff/foodFinished?orderID=${props.orderID}`) //call avocabot
      .then((response) => {
        setIsLoading(false);
        if (response.data === "OK") {
          props.fetchData();
          //setCardStatus("on the way to department");
          setListenMQTT(true);
        } else {
          throw new Error("server crash");
        }
      });
  }

  useEffect(() => {
    client.on("message", (topic, message) => {
      if (topic === "lockerIsOpen" && listenMQTT === true) {
        console.log(topic);
        setIsLoading(false);
        props.fetchData();
        //setCardStatus("arrived at department");
      }
      if (topic === "lockerIsClosed" && listenMQTT === true) {
        console.log(topic);
        setIsLoading(false);
        // get
        props.fetchData();
        //setCardStatus("on the way");
        setListenMQTTGuest(true);
      }
      if (topic === "orderStatus" && listenMQTTGuest === true) {
        let obj = {};
        if (message) {
          obj = JSON.parse(message.toString());
        }
        console.log(obj);
        if (obj.status == "arrived") {
          props.fetchData();
          //setCardStatus("arrived")
          setListenMQTTGuest(false);
        }
      }
    });
  }, [listenMQTT, listenMQTTGuest]);

  function handleOpen(event) {
    setIsLoading(true);
    api_axios.get("/staff/openLocker").then((response) => {
      setIsLoading(false);
      if (response.data === "OK") {
        setListenMQTT(true); //Avocabot's LED is on
        setIsLoading(true);
        setLockerIsOpenButton(false);
      }
    });
  }

  function handleSend(event) {
    setOrderIsAccepted(true);
    setIsLoading(true);
    api_axios
      .get(`/staff/sendAvocabot?orderID=${props.orderID}`)
      .then((response) => {
        setIsLoading(false);
        if (response.data === "order on the way") {
          //Avocabot's LED is on
          setIsLoading(true);
          setLockerIsOpenButton(true);
        }
      });
  }

  // status = pending, approved, on the way

  const renderButton = (cardStatus, statusApi) => {
    switch (statusApi) {
      case "pending":
        //setOrderIsAccepted(false);
        return (
          <button className="accept" onClick={handleAccept}>
            Accept Order
          </button>
        );
      case "approved":
        //setOrderIsAccepted(true);
        return (
          <button className="call" onClick={handleCall}>
            Call Avocabot
          </button>
        );

      case "on the way to department":
        //  setOrderIsAccepted(true);
        return <img className="loader" src={loader} />;
      case "arrived at department":
        // setOrderIsAccepted(true);
        if (lockerIsOpenButton) {
          return (
            <button className="open" onClick={() => handleOpen()}>
              Open Avocabot
            </button>
          );
        } else {
          return (
            <button className="send" onClick={() => handleSend()}>
              Send Avocabot
            </button>
          );
        }
      case "on the way":
        return <img className="delivering" src={delivering} />;
      case "arrived":
        return <p className="arrived">Arrived!</p>;
      case "complete":
        return <div></div>;
      // case "delivering":
      //   return <img className="delivering" src={delivering} />;
      // case "success":
      //   return <p>Delivered!</p>;
      // default:
      //   return <p>error</p>;
    }
  };

  return (
    <div className="card">
      <div className="top">
        <h2 className="order-id">
          <span className="orderid">Order #</span>
          {props.orderID}
        </h2>
        <h2 className="roomnumber">Room Number: {props.roomNumber}</h2>
        {/* <button className='callavocabot'>Call Avocabot</button>        */}
      </div>
      <div className="bottom">
        <div className="timestampandorder">
          <p className="time">
            <span className="tag">Time:</span> {props.timestamp}
          </p>
          <p className="orderlistwithavocado">
            <span className="tag">Order:</span>
            {props.orders}{" "}
          </p>
        </div>
        <div className='flow'>
          <div className="whatever">
            {!isLoading && renderButton(cardStatus, props.statusApi)}
          </div>
        </div>
      </div>
      <Loading />
    </div>
  );
}

export default Card;
