import React from "react";
import "./App.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class PrevCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      dislike: false,
      like: false,
      showModal: false,
    };
  }

  render() {
    return (
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.getCredits()}
          </Card.Subtitle>
          {this.getDescription()}
          <div style={{ maxWidth: 250 }}>
            {this.getLikeButton()} {this.getDislikeButton()}
          </div>
        </Card.Body>
        <Modal
          show={this.state.showModal}
          onHide={() => this.closeModal()}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Check your Recommended Tab</Modal.Title>
          </Modal.Header>
          <Modal.Body>When you like a course, similar courses are added to your recommended tab!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }

  getLikeButton() {
    let buttonVariant = this.state.like ? "success" : "dark";
    let buttonOnClick = this.changeLike.bind(this);
    let buttonText = "👍";

    return (
      <Button
        variant={buttonVariant}
        style={{
          width: 35,
          height: 35,
          fontSize: 15,
          padding: 0,
        }}
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  getDislikeButton() {
    let buttonVariant = this.state.dislike ? "danger" : "dark";
    let buttonOnClick = this.changeDislike.bind(this);
    let buttonText = "👎";

    return (
      <Button
        variant={buttonVariant}
        style={{
          width: 35,
          height: 35,
          fontSize: 15,
          padding: 0,
        }}
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  changeDislike() {
    this.setState({ dislike: !this.state.dislike });
    this.setState({ like: false });
    this.removeSubjectCart();
  }

  changeLike() {
    this.setState({ like: !this.state.like });
    this.setState({ dislike: false });
    this.addSubjectCart();
    if(this.state.like !== this.state.dislike){
      this.removeSubjectCart();
    } else {
      this.setState({ showModal: true});
    }
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  setExpanded(value) {
    this.setState({ expanded: value });
  }

  getExpansionButton() {
    let buttonText = "▼";
    let buttonOnClick = () => this.setExpanded(true);

    if (this.state.expanded) {
      buttonText = "▲";
      buttonOnClick = () => this.setExpanded(false);
    }

    return (
      <Button
        variant="outline-dark"
        style={{
          width: 25,
          height: 25,
          fontSize: 12,
          padding: 0,
          position: "absolute",
          right: 20,
          top: 20,
        }}
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  getDescription() {
    if (this.state.expanded) {
      return <div>{this.props.data.description}</div>;
    }
  }

  getCredits() {
    if (this.props.data.credits === 1) return "1 credit";
    else return this.props.data.credits + " credits";
  }
  
  addSubjectCart() {
    this.props.addSubjectCart({
      course: this.props.courseKey,
    });
  }

  removeSubjectCart() {
    this.props.removeSubjectCart({
      course: this.props.courseKey,
    });
  }
}

export default PrevCourse;
