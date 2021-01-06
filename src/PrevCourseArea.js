import React from "react";
import "./App.css";
import PrevCourse from "./PrevCourse";

class PrevCourseArea extends React.Component {
  getPrevCourses() {
    let prevCourses = [];

    if (Array.isArray(this.props.data)) {
      for (let i = 0; i < this.props.data.length; i++) {
        if (this.isCompleted(this.props.data[i].number)) {
          prevCourses.push(
            <PrevCourse
              key={i}
              data={this.props.data[i]}
              courseKey={this.props.data[i].subject}
              addSubjectCart={(data) => this.props.addSubjectCart(data)}
              removeSubjectCart={(data) => this.props.removeSubjectCart(data)}
              allCourses={this.props.allCourses}
            />
          );
        }
      }
    } else {
      for (const prevCourse of Object.keys(this.props.data)) {
        prevCourses.push(
          <PrevCourse
            key={this.props.data[prevCourse]}
            data={this.props.data[prevCourse]}
            courseKey={this.props.data[prevCourse].subject}
            addSubjectCart={(data) => this.props.addSubjectCart(data)}
            removeSubjectCart={(data) => this.props.removeSubjectCart(data)}
            allCourses={this.props.allCourses}
          />
        );
      }
    }

    return prevCourses;
  }

  isCompleted(num) {
    return this.props.completed.data.includes(num);
  }

  render() {
    return (
      <div style={{ margin: 5, marginTop: -5 }}>{this.getPrevCourses()}</div>
    );
  }
}

export default PrevCourseArea;
