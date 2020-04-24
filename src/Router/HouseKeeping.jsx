import React, { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import api_axios from "../api.js";
import loader from "../loadingbig.gif";

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
client.subscribe("frontend/updateAmenityOrder");

const CreateCardList = (props) => {
  let cardList = props.amenityLists.map((amenityItem) => {
    return createCard(amenityItem, props.fetchData);
  });
  return cardList;
};

function createCard(amenityItem, fetchData) {
  const mapOrdersToString = (orders) => {
    let listOrder = orders.map((order) => {
      return (
        <React.Fragment key={order.amenityName}>
          {`🥑 ${order.amenityName} X${order.amount}`}
          <br />
        </React.Fragment>
      );
    });
    return listOrder;
  };

  return (
    <Card
      key={amenityItem.orderID}
      orderID={amenityItem.orderID}
      roomNumber={amenityItem.roomNumber}
      orders={mapOrdersToString(amenityItem.orders)}
      timestamp={amenityItem.timestamp}
      statusApi={amenityItem.status}
      fetchData={fetchData}
    />
  );
}

function HouseKeeping(props) {
  const [amenityLists, setAmenityLists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = () => {
    setIsLoading(true)
    api_axios.get("/staff/getAmenityOrders").then((response) => {
      setAmenityLists(response.data);
      setIsLoading(false)
    });
  };

  useEffect(()=>{
    if(!localStorage.token){
      props.history.push('/')

    }
  },[])

  useEffect(() => {
    fetchData();
    client.on("message", (topic, message) => {
      if (topic === "frontend/updateAmenityOrder") {
        fetchData();
        console.log(message.toString());
      }
    });

    // .catch
  }, []);

  useEffect(() => {
    setOrders(amenityLists.orders);
  }, [amenityLists]);

  const logOut = () =>{
    localStorage.clear(); 
    props.history.push('/');
  }

  return (
    <div>
    <button style ={{backgroundColor:'#FFF2CB', color: '#C1B841', border:'none', cursor: 'pointer', padding: '10px' }}onClick= {logOut} >Sign Out</button>
      <div>
          <h1 className="heading">House Keeping</h1>
          <div className="topbar">
            <h2 className="orderlists">Order Lists</h2>
            {/* <img className='fetching' src={loader} /> */}
            {isLoading? <img className='fetching' src={loader} />:<p></p> }
          </div>
      </div>
      <CreateCardList amenityLists={amenityLists} fetchData={fetchData} />
    </div>
  );
}

export default HouseKeeping;
