'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const Queue = require('./queue');
// const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

const cats = new Queue();
const dogs = new Queue();

cats.enqueue({
  imageURL: 'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
  imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
  name: 'Fluffy',
  sex: 'Female',
  age: 2,
  breed: 'Bengal',
  story: 'Thrown on the street'
});
cats.enqueue({
  imageURL: 'https://lh3.googleusercontent.com/1T9fGpQrbg-doYqt5C-7amJMi3ojEpPc4T-1bRM0HswI_um_cnIc3TM7oTb_-N16SDckloFs70TMIIHQvoQRUfiLi8fjFZpjwP2LiMsGsW4g3GEHB_cV-KaKpaNJPRa2k7-ENfAmKBO8vnt5SIQu5K8AhGwlFt09N0YaF_I59KGIvOsiaxI1MsTyWbKiye_0XN_pK20YZFVaODnswZtbstEbezn9GMAdbg54nu0fabJKHRTiVDxe1s3wKjIWOFLCpOGA9eAQXKw5FnINjAP_Kz1_v6v-Ut2oVb578INGtZxVBWvGOfPwmtfRlXSSZVuFIX7TcJWFRX0tRhkfN2FZaeo5BRGWJ4Ik6wQDPjiwquysFy85v6SDy0CdmCmSBZt6ug5A7fBsxsrlKlDYf3Rd_CvuXCxlsEctDb-ZICfam5SgUMDBziB6m2KeSB3g1QCS_CTaoLcGSexZtWV9bloABszwRzFHuvdeGOC3P_7faL6r9YVXVp3HQUX7p1fYm_S1Y7wtLYwezdijlHSqUdwjy7-2Jm5Z8xsMGcuI-ogDP5g3Xqs8sqKBrLLxJV3V2LpUS27D_pIMiAM1Axu-7On23gPAHChJrwrFYE9T7cncWe4PrRyTG2jEfSuBq6eOAqyRq_LvM823lJEjsJqvlk7kiAgDsgKwF10ccUWMANIyS0UpJJD33Asz44qU19ydLnDWHjrcYW5w3dxJVMCYoB-65zuYDQ=w960-h720-no',
  imageDescription: 'White cat lounging on a black sofa',
  name: 'Snowflake',
  sex: 'Female',
  age: 8,
  breed: 'White',
  story: 'Lived with three generations of the Taylor/Houck family. Very chatty.'
});
cats.enqueue({
  imageURL: 'https://www.softpaws.com/template/images/landing_page/july_cat_image.jpg',
  imageDescription: 'A cat wearing sunglasses',
  name: 'Tomcat Cruise',
  sex: 'Male',
  age: 4,
  breed: 'Tabby',
  story: 'Is too cool for school. Loves jumping on couches.'
});

dogs.enqueue({
  imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Zeus',
  sex: 'Male',
  age: 3,
  breed: 'Golden Retriever',
  story: 'Owner Passed away'
});
dogs.enqueue({
  imageURL: 'https://i.imgur.com/PwRafnN.jpg',
  imageDescription: 'A sleepy shiba laying in a ball', name: 'Mila', sex: 'Female', age: 3, breed: 'Shiba Inu', story: 'Too beautiful for owner'
});
dogs.enqueue({
  imageURL: 'https://i.imgur.com/uKnMvyp.jpg',
  imageDescription: 'A holy husky walking on water', name: 'Hank', sex: 'Male', age: 3, breed: 'Husky', story: 'Scared owner after turning kibble to chicken'
});

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cat', (req, res, next) => {
  return res.json(cats.peek());
});

app.delete('/api/cat', (req, res, next) => {
  cats.dequeue();
  return res.sendStatus(204);
});

app.get('/api/dog', (req, res, next) => {
  return res.json(dogs.peek());
});

app.delete('/api/dog', (req, res, next) => {
  dogs.dequeue();
  return res.sendStatus(204);
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  // dbConnect();
  runServer();
}

module.exports = { app };
