import CFonts from 'cfonts';
import Chalk from 'chalk'

export const run = (Text) => {
	CFonts.say(Text, {
		font: 'chrome',              
		align: 'center',              
		colors: ['#0ff','green','#ff0'],         
		background: 'transparent', 
		letterSpacing: 1,          
		lineHeight: 3,      
		space: false,
		maxLength: '10',      
	})
}

export const Konsol = (Type,Underline = '', sender ) => {
    console.log(Chalk.cyan(`[ ${Type} ] ${Chalk.green.underline(Underline)} from ${Chalk.yellowBright(sender.split`@`[0])}`))
}
