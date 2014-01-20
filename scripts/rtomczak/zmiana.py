import csv
file = open("airports.csv","r")
f = open("lotniska.csv", "w")
f.write('Name,City,Country,IATA/FAA,ICAO,Latitude,Longitude,Altitude,Timezone,DST\n')
for l in csv.reader(file,delimiter = ",", skipinitialspace = True):
	lo = l[1:]
	f.write(",".join(lo)+"\n")
f.close()
file.close()