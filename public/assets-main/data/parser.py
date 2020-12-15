import os
import json
import re

DIRECTORY = 'original/'
IMG_PATH = '/assets-main/images/moon-128/'

def write_json(data, filename='moonPhases.JSON'):
    with open(filename,'w') as f:
        json.dump(data, f,indent=2)
phases = []
for filename in os.listdir(DIRECTORY):

    reg = re.search('moonPhase_(\d+)',filename)
    if (reg):
        phase = reg.group().split("_")[1]
        print("Obtaining data from: `" + filename +"` with phase: "+phase)

        with open(DIRECTORY+filename) as json_file:
            data = json.load(json_file); new_data =[];
            days_data = data['locations'][0]['astronomy']['objects'][0]['days']
            days = []; newmoon_init = ''; fullmoon = ''; newmoon_fin = ''
            load_newmoon_init = True; load_newmoon_fin = False;
            load_fullmoon = False;

            idx = 0
            for day in days_data:
                img = {"image": IMG_PATH + str(idx)+'.png' }

                day.update(img)
                days.append(day)
                idx = idx + 1

                if (len(day["events"]) == 3):
                    if (load_newmoon_fin):
                        newmoon_fin = {"newmoon 30" : day["events"][2]}
                        load_newmoon_fin = False

                    if (load_fullmoon):
                        fullmoon = {"fullmoon": day["events"][2]}
                        load_fullmoon= False
                        load_newmoon_fin = True
                    if (load_newmoon_init):
                        newmoon_init = {"newmoon 0" : day["events"][2]}
                        load_newmoon_init = False;
                        load_fullmoon = True


            new_data.append(newmoon_init)
            new_data.append(newmoon_fin)
            new_data.append(fullmoon)
            new_data.append({ "days": days })
        phases.append({"phase": phase, "data": new_data})

phases.sort(key=lambda x:int(x["phase"]))
write_json(phases)
