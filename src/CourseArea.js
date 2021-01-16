import React from "react";
import "./App.css";
import Course from "./Course";

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (this.props.loading) {
      courses.push(<div class="spinner-border text-primary my-4 mx-3" role="status">
      </div>);
      return courses
    }

    if (Array.isArray(this.props.data)) {
      for (let i = 0; i < this.props.data.length; i++) {
        let canEnroll = this.checkRequisites(this.props.data[i].requisites);
        if (
          this.props.interests &&
          this.isCompleted(this.props.data[i].number)
        ) {
          courses.push(
            <Course
              key={i}
              data={this.props.data[i]}
              courseKey={this.props.data[i].number}
              canEnroll={canEnroll}
              addCartCourse={(data) => this.props.addCartCourse(data)}
              removeCartCourse={(data) => this.props.removeCartCourse(data)}
              cartCourses={this.props.cartCourses}
              interests={this.props.interests}
            />
          );
        }
        if (!this.props.interests) {
          courses.push(
            <Course
              key={i}
              data={this.props.data[i]}
              courseKey={this.props.data[i].number}
              canEnroll={canEnroll}
              addCartCourse={(data) => this.props.addCartCourse(data)}
              removeCartCourse={(data) => this.props.removeCartCourse(data)}
              cartCourses={this.props.cartCourses}
              interests={this.props.interests}
            />
          );
        }
      }
    } else {
      for (const course of Object.keys(this.props.data)) {
        let canEnroll = this.checkRequisites(
          this.props.data[course].requisites
        );
        courses.push(
          <Course
            key={this.props.data[course].number}
            data={this.props.data[course]}
            courseKey={this.props.data[course].number}
            canEnroll={canEnroll}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
            interests={this.props.interests}
          />
        );
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  checkRequisites(req) {
    let check = false;
    let flag = 0;
    if (this.props.completed !== undefined) {
      req.map((element, index) => {
        if (element.some((r) => this.props.completed.data.includes(r))) {
          if (flag === 0) {
            check = true;
          }
        } else {
          check = false;
          flag = 1;
        }
      });
    }
    if (req === undefined || req.length === 0) {
      check = true;
    }

    return check;
  }

  isCompleted(num) {
    return !this.props.completed.data.includes(num);
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default CourseArea;
