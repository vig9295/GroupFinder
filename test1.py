import csv
import math
import datetime
import random

csvfile = open("orders.csv", 'r')
reader = csv.reader(csvfile, dialect=csv.excel_tab, delimiter=',')
next(reader, None)

ParcelRatesFile = open("Parcel_Rates.csv", 'rU')
rateReader = csv.reader(ParcelRatesFile)
parcelRatesDict = {}
for row in rateReader:
    parcelRatesDict[row[0] + "-" + row[1]] = row[2]



ParcelZonesFile = open("ParcelZones.csv", 'rU')
zoneReader = csv.reader(ParcelZonesFile)
zoneDict = {}
for row in zoneReader:
    zoneDict[row[0]] = row[1]


costFile = open("TransportationData.csv", 'rU')
costReader = csv.reader(costFile)
costDict = {}
for row in costReader:
    costDict[row[0]] = row



productsFile = open("products.csv", 'rU')
productReader = csv.reader(productsFile)
productList = next(productReader)


dict = {}

def eligibleForParcel(item):
	if item in productList:
		return False
	return True


for row in reader:
	row = row[0].split("%")
	try:
		combo = row[7] + " " + row[13]
		temp = dict[combo]
		temp[2] = int(temp[2]) + int(row[1])
		temp[3].append(row[9])
		temp[4] = float(temp[4]) + float(row[5])
		temp[5].append(row[11])
		dict[combo] = temp
	except:
		combo = row[7] + " " + row[13]
		dict[combo] = [row[7], row[13], row[1], [row[9]], row[5],[row[11]], row[4]]

#{CustID + IP Date : Cust ID, IP Date, Number of Things, List of Sales Order IDs, Weight, List of Work Centers, Zip Code}
finalList = [["Customer ID", "IP Date", "Number of Things", "Number of Sales Order IDs", "Zip Code", "Weight", "Cost", "Transportation"]]
for x in dict:
	temp = dict[x]
	cost = 0
	parcelType = ''
	toAppend = []
	toAppend.append(temp[0])
	toAppend.append(temp[1])
	toAppend.append(temp[2])
	toAppend.append(len(temp[3]))
	toAppend.append(temp[6])
	toAppend.append(temp[4])
	zip1 = temp[6]
	if (len(zip1) > 2):
		zip1 = zip1[:3]
	else:
		zip1 = zip1[:2]
	zone = zoneDict[str(int(zip1))]
	avg_wt = float(temp[4])/float(temp[2])
	wt_ind = min(150, int(math.ceil(avg_wt)))

	parcelCost = parcelRatesDict[str(wt_ind) + "-" + zone]
	totalParcelCost = float(parcelCost) * int(temp[2])

	totalParcelCost = float(totalParcelCost)
	zipcode = temp[6][:3]
	if int(zipcode) > 915:
		zipcode = '915'
	current_row = costDict[str(int(zipcode))]
	cost_row = []
	for z in current_row[2:9]:
		cost_row.append(float(z[1:]))
	wt = float(temp[4])
	if wt <= 500:
		ltl_cost = max(cost_row[0], min(wt * cost_row[1], 501 * cost_row[2]))
	elif wt <= 1000:
		ltl_cost = max(cost_row[0], min(wt * cost_row[2], 1001 * cost_row[3]))
	elif wt <= 2000:
		ltl_cost = max(cost_row[0], min(wt * cost_row[3], 2001 * cost_row[4]))
	elif wt <= 5000:
		ltl_cost = max(cost_row[0], min(wt * cost_row[4], 5001 * cost_row[5]))
	elif wt <= 10000:
		ltl_cost = max(cost_row[0], min(wt * cost_row[5], 10001 * cost_row[6]))
	else:
		ltl_cost = max(cost_row[0], wt * cost_row[6])
	ltl_cost = float(ltl_cost)
	check = []
	for w in temp[5]:
		check.append(eligibleForParcel(w))

	if ltl_cost < totalParcelCost:
		cost = ltl_cost
		toAppend.append(cost)
		toAppend.append("LTL")
	else:
		if False in check:
			cost = ltl_cost
			toAppend.append(cost)
			toAppend.append("LTL")
		else:
			cost = totalParcelCost
			toAppend.append(cost)
			toAppend.append("Parcel")
	finalList.append(toAppend)

with open("orders_consolidated.csv", 'w', newline = '') as outfile:
    writer = csv.writer(outfile, delimiter = ',')
    writer.writerows(finalList)
