import os
import json
import re

DIRECTORY = 'original/'

def write_json(data, filename='moonPhases.JSON'):
    with open(filename,'w') as f:
        json.dump(data, f,indent=2)
months = []
for filename in os.listdir(DIRECTORY):
    print("filename",filename)
    reg = re.search('moonPhase_(\d+)',filename)
    if (reg):
        month = reg.group().split("_")[1]
        print("with month: ",month)
        with open(DIRECTORY+filename) as json_file:
            data = json.load(json_file); new_data =[];
            days_data = data['locations'][0]['astronomy']['objects'][0]['days']
            days = []; newmoon_init = ''; fullmoon = ''; newmoon_fin = ''
            load_newmoon_init = True; load_newmoon_fin = True;
            load_fullmoon = True;

            idx = 0
            for day in days_data:
                img = {"image": str(idx)+'.png' }

                day.update(img)
                days.append(day)

                if (len(day["events"]) == 3):
                    if (load_newmoon_init):
                        newmoon_init = {"newmoon 0" : day["events"][2]}
                        load_newmoon_init = False;
                    if (load_newmoon_fin):
                        newmoon_fin = {"newmoon 30" : day["events"][2]}
                        load_newmoon_fin = False;
                    if (load_fullmoon):
                        fullmoon = {"fullmoon": day["events"][2]}
                        load_fullmoon= False
                ++ idx

            new_data.append(newmoon_init)
            new_data.append(newmoon_fin)
            new_data.append(fullmoon)
            new_data.append({ "days": days })
        months.append({"month": month, "data": new_data})

months.sort(key=lambda x:int(x["month"]))
write_json(months)
