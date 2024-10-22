import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Cards.css'

function Cards() {
  return (
    <Card className="tinder-card" style={{ width: '20rem' }}>
      <Card.Img variant="top" src="/pasta.jpg" className="card-image" draggable="false"/>
      <Card.Body className="text-center">
        <Card.Title className="card-title">Pasta</Card.Title>
        <Card.Text>
          Pates bien bonnes bien caloriques (non)
        </Card.Text>
        <div className="button-group">
          <Button variant="danger" className="me-2">Beurk</Button>
          <Button variant="success">J'ADORE</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Cards;
