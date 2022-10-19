program        = expression* EOF ;
expression     = equality ;
equality       = comparison ( ( "=" ｜ "<>" ) comparison )* ;
comparison     = term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           = factor ( ( "-" | "+" ) factor )* ;
factor         = expo ( ( "/" | "*" ) expo )* ;
expo           = connection ( "^"  expo )* ;
connection     = percent ( ( "&" ) percent )* ;
percent        = percent | unary ( "%" );
unary          = ( "+" | "-" ) unary | call ;
call           = cellOp ( "(" arguments? ")" ) ;
cellOp         = primary ( ":" ) primary ;
primary        = literal | identifier | "(" expression ")" | error;
parameters     = identifier ( "," identifier )* ;
arguments      = expression ( "," expression )* ;
literal        = number | string | cell
cell           = ABSOLUTE_CELL | MIXED_CELL | RELATIVE_CELL ;
ABSOLUTE_CELL  = "$" char+ "$" digit+
MIXED_CELL     = ("$" RELATIVE_CELL) | (char+ "$" digit+) 
RELATIVE_CELL  = char+ | digit+   
number         = digit+ ( "." digit+ )?;
string         = """ (any char except ") """ ;
identifier     = alpha ( alpha | digit )* ;
alpha          = char | "_" ;
char           = "a" ... "z" | "A" ... "Z" ;
digit          = "0" ... "9" ;
error          = "#" ("A" ... "Z")+ ("!" | "?")? ;

