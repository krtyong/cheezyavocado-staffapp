import React from "react";
import Card from "../components/Card.jsx"
import amenityLists from "../amenityLists.js"

function createCard(amenityItem) {
    console.log(amenityItem) //ได้
    return (
        <Card
            key={amenityItem.order_id}
            order_id={amenityItem.order_id}
            room_number={amenityItem.room_number}
            customer_name={amenityItem.customer_name}
            order_items={amenityItem.order_items}
        />
    );
}

function HouseKeeping() {
    return (
        <div>
            <h1 className="heading">Kitchen</h1>
            <h2 className="orderlists">Order Lists</h2>
            {amenityLists.map(createCard)}
        </div>
    );
}

export default HouseKeeping;