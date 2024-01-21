import { numeric, pgTable, serial, boolean, integer, text } from "drizzle-orm/pg-core";

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    date: text('date'),
    merchant: text('merchant'),
    status: text('status'),
    amount: numeric('amount'),
    accounttype: text('accounttype'),
    user: text('user')
});

export const flights = pgTable('flights', {
    id: serial('id').primaryKey(),
    flightNumber: text('flight_number'),
    origin: text('origin'),
    destination: text('destination'),
    duration: text('duration'),
    flightStatus: text('flight_status'),
});

export const airports = pgTable('airports', {
    id: serial('id').primaryKey(),
    cityName: text('cityname'),
    airportCode: text('airportcode'),
    country: text('country'),
});



export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username'),
    password: text('password'),
    email: text('email'),
    preferredseating: text('preferredseating'),
    mealoption: text('mealoption'),
    toggleclub: boolean('toggleclub'),
    statuslevel: text('statuslevel'), 
    flights: integer('flights')
})

export const bookedflights = pgTable('bookedflights', {
    id: serial('id').primaryKey(),
    user: text('user'),
    origin: text('origin'),
    destination: text('destination'),
    clublevel: text('clublevel'), 
})

export const galaxymarketplace = pgTable('galaxymarketplace', {
    id: serial('id').primaryKey(),
    vendor: text('vendor'),
    item: text('item'),
    cost: text('cost')
})
