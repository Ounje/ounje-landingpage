import { Button } from "../Button";

export default function JoinTeamSection() {
  return (
    <>
      <section className="py-10 bg-[#2C5E2E] flex justify-center items-center pb-10 ">
        <div className="md:w-[60vw] w-[90vw] bg-[#FFCA3A] py-5 px-10 rounded-[20px] flex flex-col justify-center items-center gap-1">
          <h2>Join Our Team</h2>
          <p className="text-center">
            Together we can make a difference in serving the nation one plate at
            a time.
          </p>
          <Button className="flex justify-center items-center gap-2 rounded-[12px] bg-[#2C5E2E] hover:bg-[#2C5E2E]/50 ">
            <span>Click Here To Check For Open Roles</span>
            <img src="/icons/next.png" alt="next icon" />
          </Button>
        </div>
      </section>
    </>
  );
}
