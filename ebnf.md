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
ABSOLUTE_CELL  = ("$" [A-Za-z]+ "$" [0-9]+) | ("$" [A-Za-z]+) | ("$" [0-9]+)
MIXED_CELL     = ("$" [A-Za-z]+[0-9]+ ) | ([A-Za-z]+ "$" [0-9]+ )
RELATIVE_CELL  = [A-Za-z]+ [0-9]+
number         = digit+ ( "." digit+ )?;
string         = """ (any char except ") """ ;
identifier     = letter ( letter | digit )* ;
letter           = "a" ... "z" | "A" ... "Z" ;
digit          = "0" ... "9" ;
error          = "#" ("A" ... "Z")+ ("!" | "?")? ;
```

```
Start ::= Constant
| '=' Formula
| '{=' Formula '}'
Formula ::= Constant
| Reference
| FunctionCall
| '(' Formula ')'
| ConstantArray
| RESERVED-NAME
Constant ::= NUMBER | STRING | BOOL | ERROR
FunctionCall ::= EXCEL-FUNCTION Arguments ')'
| UnOpPrefix Formula
| Formula ‘%’
| Formula BinOp Formula
UnOpPrefix ::= ‘+’ | ‘-’
BinOp ::= ‘+’ | ‘-’ | ‘*’ | ‘/’ | ‘^’
| ‘<’ | ‘>’ | ‘=’ | ‘<=’ | ‘>=’ | ‘<>’
Arguments ::= Argument { ‘,’ Argument }
Argument ::= Formula
Reference ::= ReferenceItem
| RefFunctionCall
| '(' Reference ')'
| Prefix ReferenceItem
| FILE '!' DDECALL
RefFunctionCall ::= Union
| RefFunctionName Arguments ')'
| Reference ‘:’ Reference
| Reference ‘ ’ Reference
ReferenceItem ::= CELL
| NamedRange
| VERTICAL-RANGE
| HORIZONTAL-RANGE
| UDF Arguments ')'
| ERROR-REF
Prefix ::= SHEET
| FILE SHEET
| FILE '!'
| QUOTED-FILE-SHEET
| MULTIPLE-SHEETS
| FILE MULTIPLE-SHEETS
RefFunctionName ::= REF-FUNCTION
| REF-FUNCTION-COND
NamedRange ::= NR | NR-PREFIXED
Union ::= '(' Reference { ',' Reference } ')'
ConstantArray ::= '{' ArrayColumns '}'
ArrayColumns ::= ArrayRows { ';' ArrayRows }
ArrayRows ::= ArrayConst { ',' ArrayConst }
ArrayConst ::= Constant
| UnOpPrefix NUMBER
| ERROR-REF
```
