import React, { useState, useEffect } from "react"
import foodLists from "../foodLists.js"
import Card from "../components/Card.jsx"

function createCard(foodItem) {
    console.log(foodItem) //ได้

    return (
        <Card
            key={foodItem.order_id}
            order_id={foodItem.order_id}
            room_number={foodItem.room_number}
            customer_name={foodItem.customer_name}
            order_items={foodItem.order_items}
            time={foodItem.time}
            cost={foodItem.cost}
        />
    );
}

function Kitchen() {

    const [food, setFood] = useState(null);

    // useEffect(() => {
    //     //fectch data รอไว้เลย
    //     const response = await fetch('');
    //     const data = await response.json();
    //     const [item] = data.result;
    //     setFood(item);
        
    // }, []);

    return (
        <div>
            <h1 className="heading">Kitchen</h1>
            <h2 className="orderlists">Order Lists</h2>
            {foodLists.map(createCard)}
        </div>
    );
}

export default Kitchen;