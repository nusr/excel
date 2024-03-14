# EBNF

```plain text
program        = expression* EOF ;
expression     = equality ;
equality       = comparison ( ( "=" ｜ "<>" ) comparison )* ;
comparison     = term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           = factor ( ( "-" | "+" ) factor )* ;
factor         = expo ( ( "/" | "*" ) expo )* ;
expo           = concatenate ( "^"  expo )* ;
concatenate     = percent ( ( "&" ) percent )* ;
percent        = percent | unary ( "%" );
unary          = ( "+" | "-" ) unary | spread ;
spread         = call ( ( ":" ) call )* ;
call           = primary ( "(" arguments? ")" ) * ;
primary        = literal | identifier | "(" expression ")" | error;
arguments      = expression ( "," expression )* ;
literal        = number | string | ABSOLUTE_CELL | MIXED_CELL | RELATIVE_CELL
ABSOLUTE_CELL  = "$" [A-Za-z]+ "$" [0-9]+
MIXED_CELL     = ("$" [A-Za-z]+[0-9]+ ) | ([A-Za-z]+ "$" [0-9]+ )
RELATIVE_CELL  = [A-Za-z]+ [0-9]+
number         = digit+ ( "." digit+ )?;
string         = """ (any char except ") """ ;
identifier     = letter ( letter | digit )* ;
letter           = "a" ... "z" | "A" ... "Z" ;
digit          = "0" ... "9" ;
error          = "#" ("A" ... "Z")+ ("!" | "?")? ;
```
