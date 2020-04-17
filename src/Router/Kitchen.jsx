import React, { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import api_axios from "../api.js";

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
client.subscribe("frontend/updateKitchenOrder");

const CreateCardList = (props) => {
  let cardList = props.foodLists.map((foodItem) => {
    return createCard(foodItem, props.fetchData);
  });
  return cardList;
};

function createCard(foodItem, fetchData) {
  const mapOrdersToString = (orders) => {
    let listOrder = orders.map((order) => {
      return (
        <React.Fragment key={order.foodName}>
          {`🥑 ${order.foodName} X${order.amount}`}
          <br />
        </React.Fragment>
      );
    });
    return listOrder;
  };

  return (
    <Card
      key={foodItem.orderID}
      orderID={foodItem.orderID}
      roomNumber={foodItem.roomNumber}
      orders={mapOrdersToString(foodItem.orders)}
      timestamp={foodItem.timestamp}
      statusApi={foodItem.status}
      fetchData={fetchData}
    />
  );
}

function Kitchen() {
  const [foodLists, setFoodLists] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchData = () => {
    api_axios.get("/staff/getFoodOrders").then((response) => {
      setFoodLists(response.data);
    });
  };

  useEffect(() => {
    fetchData();
    client.on("message", (topic, message) => {
      if (topic === "frontend/updateKitchenOrder") {
        fetchData();
        console.log(message.toString());
      }
    });

    // .catch
  }, []);

  useEffect(() => {
    setOrders(foodLists.orders);
  }, [foodLists]);

  return (
    <div>
      <div className="topbar">
        <h1 className="heading">Kitchen</h1>
        <h2 className="orderlists">Order Lists</h2>
      </div>
      {/* {foodLists.map(createCard)} */}
      <CreateCardList foodLists={foodLists} fetchData={fetchData} />
    </div>
  );
}

export default Kitchen;
