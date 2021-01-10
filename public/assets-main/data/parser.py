import os
import json
import re

DIRECTORY = 'original/'
IMG_PATH = '/assets-main/images/moon-fuzzy/'

def write_json(data, filename='moonPhases.JSON'):
    with open(filename,'w') as f:
        json.dump(data, f,indent=2)
phases = []
prev_new_moon = None
prevIdx = 0

dirFiles = os.listdir(DIRECTORY)
def getint(filename):
    reg = re.search('moonPhase_(\d+)',filename)
    phase = reg.group().split("_")[1]
    return int(phase)

dirFiles.sort(key=getint)
for filename in dirFiles:
    reg = re.search('moonPhase_(\d+)',filename)
    if (reg):
        phase = reg.group().split("_")[1]
        print("Obtaining data from: `" + filename +"` with phase: "+phase)

        with open(DIRECTORY+filename) as json_file:
            data = json.load(json_file); new_data =[];
            days_data = data['locations'][0]['astronomy']['objects'][0]['days']
            days = []; newmoon_init = ''; fullmoon = ''; newmoon_fin = ''
            first_quarter = ''; thrid_quarter='';
            load_newmoon_init = True; load_newmoon_fin = False;

            idx = 0

            for day in days_data:
                img = {"image": IMG_PATH + str(idx)+'.png' }

                day.update(img)
                days.append(day)

                if (day["moonphase"] == "firstquarter"):
                    first_quarter = {
                        "firstquarter":
                        {"idx": idx }
                   }

                if (day["moonphase"] == "thirdquarter"):
                   third_quarter = {
                       "thirdquarter":
                       {"idx": idx }
                   }

                idx = idx + 1

                if  (len(day["events"]) == 3 and day["events"][2]["type"] == "newmoon"):
                    if (phase == "1"):
                        if (load_newmoon_init):
                            newmoon_init = {"newmoon 0" : day["events"][2]}
                            load_newmoon_init = False
                        else:
                            newmoon_fin = {"newmoon 30" : day["events"][2]}
                            prev_new_moon = {"newmoon 0" : day["events"][2]}
                    else:
                        newmoon_init = prev_new_moon
                        newmoon_fin = {"newmoon 30" : day["events"][2]}
                        prev_new_moon = {"newmoon 0" : day["events"][2]}

                if (len(day["events"]) == 3 and day["events"][2]["type"] == "fullmoon"):
                        fullmoon_data = day["events"][2]
                        fullmoon_data.update({"idx": idx - 1})
                        fullmoon = {"fullmoon": fullmoon_data}

            #Update next and previous quarters in phase-days steps
            idx = 0

            nextIdx = first_quarter["firstquarter"]["idx"]
            for day in days:
                day.update({"nextquarter": (nextIdx - idx)})
                day.update({"prevquarter": (prevIdx - idx)})

                if (idx > 0):
                    prevIdx == 0

                if(idx == first_quarter["firstquarter"]["idx"]):
                    nextIdx = fullmoon_data["idx"]
                    prevIdx = 0

                if(idx > first_quarter["firstquarter"]["idx"]):
                    nextIdx = fullmoon_data["idx"]
                    prevIdx = first_quarter["firstquarter"]["idx"]

                if(idx == fullmoon_data["idx"]):
                    nextIdx = third_quarter["thirdquarter"]["idx"]
                    prevIdx = first_quarter["firstquarter"]["idx"]

                if(idx > fullmoon_data["idx"]):
                    nextIdx = third_quarter["thirdquarter"]["idx"]
                    prevIdx = fullmoon_data["idx"]

                if(idx == third_quarter["thirdquarter"]["idx"]):
                    nextIdx = len(days) - 1
                    prevIdx = fullmoon_data["idx"]

                if(idx > third_quarter["thirdquarter"]["idx"]):
                    nextIdx = len(days) - 1
                    prevIdx = third_quarter["thirdquarter"]["idx"]

                if(idx == len(days)-1):
                    prevIdx = prevIdx - (len(days)-1)
                    nextIdx = 0

                idx = idx + 1

            #print("init", newmoon_init,"\n","fin:", newmoon_fin,"\n\n")
            new_data.append(newmoon_init)
            new_data.append(newmoon_fin)
            new_data.append(fullmoon)
            new_data.append({ "days": days })
            new_data.append(first_quarter)
            new_data.append(third_quarter)
        phases.append({"phase": phase, "data": new_data})

phases.sort(key=lambda x:int(x["phase"]))
write_json(phases)
