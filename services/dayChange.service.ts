import { Expense } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { calculateDailyRemaining } from "@/utils/daily/calculateDailyRemaning";

type ServiceProps = {
    dailyLimit:number,
    expenses: Expense[],
    activeGoal? : Goal | null, 
}

type ServiceResults = {
    shouldShowModal: boolean,
    remaining?: number,
    projectedRemainingDays?: number,
}

export function dayChangeService({dailyLimit,expenses,activeGoal}:ServiceProps) : ServiceResults{
    const dailyRemaining = calculateDailyRemaining(dailyLimit,expenses).remaining;

    if(dailyRemaining<= 0 ){
        return {
            shouldShowModal : false
        }
    }
    if (!activeGoal || activeGoal.status !== "active") {
      return {
        shouldShowModal: false,
      };
    }else{
        const dailyTarget = activeGoal.targetAmount / activeGoal.durationInDays;
        const remainingAmount = activeGoal.targetAmount - (activeGoal.savedAmount + dailyRemaining);
        const projectedRemainingDays = Math.ceil(remainingAmount / dailyTarget)
        return{
            shouldShowModal:true,
            remaining: dailyRemaining,
            projectedRemainingDays,
        }
    }

}