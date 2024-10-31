import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(   // new는 그냥 새로운 스키마하나를 만드는것이라고 생각하면 된다.
  {
    title : {
      type : String,
      required : true,
      maxLength : 30,
    },
    description : {
      type : String,
    },
    isComplete : {
      type : Boolean,
      required : true,
      default : false,
    },
  },
  {
    timestamps : true,  // createdAt과 updatedAt을 자동으로 설정해줌
  }
)

const Task = mongoose.model('Task', TaskSchema);   // model은 스키마를 기반으로 해서 객체를 생성하고 조회하고 수정하고 삭제할수있는 그런 인터페이스이다.
//mongoose.model의 첫번째 아규먼트는 첫글자를 대문자로 쓰고, 단수형으로 쓴다. 이 이름은 mongoDB에서 다룰 컬렉션이름을 결정짓는다.


export default Task;