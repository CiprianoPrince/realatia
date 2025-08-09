import { RegisterFormContainer } from "@/context/user-management/components";

const Register = () => {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-row">
        <div className="basis-3/5 h-full">
          <img src="" alt="" />
        </div>

        <div className="basis-2/5 h-full flex justify-center items-center">
          <RegisterFormContainer className="w-full max-w-lg p-4" />
        </div>
      </div>
    </div>
  );
};

export default Register;
